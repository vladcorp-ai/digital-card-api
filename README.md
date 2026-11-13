# Digital Card API

Цифровая визитка backend-разработчика: GraphQL API с профилем, навыками, опытом работы и проектами.

**Стек:** TypeScript · Node.js 24 · NestJS 12 · GraphQL (Apollo Server 5) · Prisma 7 · PostgreSQL 18 · Docker

- Apollo Sandbox: https://api-production-60b288e4.up.railway.app/graphql
- Локально: http://localhost:3000/graphql

## Запуск с нуля

```bash
git clone https://github.com/vladcorp-ai/digital-card-api.git
cd digital-card-api
docker compose up --build
```

Откройте http://localhost:3000/graphql — это Apollo Sandbox. База данных подготавливается автоматически.

## Пример запроса

```graphql
query {
  profile {
    name
    description
    links { title url }
    skills { name }
    experience { company position startDate endDate achievements }
    projects { name url }
  }
}
```

## Архитектура и обоснование решений

```
src/
├── prisma/        PrismaService — единственное подключение к БД (global module)
├── graphql/       контекст запроса, фабрика DataLoader'ов, groupByKey
├── profile/       профиль + ссылки        ┐
├── skill/         навыки                  │ модуль на сущность:
├── experience/    опыт + достижения       │ model → resolver → service → repository
└── project/       проекты                 ┘
prisma/
├── schema.prisma  схема БД
├── migrations/    SQL-миграции (в git)
├── seed.ts        заполнение БД
└── seed-data.ts   данные визитки — единственное место с персональными данными
```

### Разделение ответственности

| Слой | Отвечает за | Не знает о |
|------|-------------|------------|
| `*.resolver.ts` | форма GraphQL API: какие поля, откуда брать | Prisma, SQL |
| `*.service.ts` | бизнес-логика: батчинг, форматирование периода работы, ошибка «профиль не найден» | GraphQL-декораторах резолверов |
| `*.repository.ts` | запросы к БД через Prisma: фильтры, сортировка | GraphQL, DataLoader |
| `*.model.ts` | GraphQL-типы (code-first) | БД |

Связь с БД закрыта репозиториями. Если сменить ORM или источник данных, резолверы и сервисы не меняются.

### GraphQL: code-first

Схема генерируется из TypeScript-классов. Типы API и код не расходятся, отдельного `.graphql`-файла, который нужно поддерживать вручную, нет.

### Вложенные данные без N+1 (DataLoader)

Корневой запрос `profile` берёт только саму запись профиля. Каждый вложенный список (`links`, `skills`, `experience`, `projects`, `experience.achievements`) резолвится отдельным `@ResolveField` через DataLoader:

- **запрашиваются только нужные поля.** Если в запросе нет `skills`, к таблице навыков обращения нет;
- **один SQL-запрос на тип связи.** Все ключи одного уровня собираются в `WHERE ... IN (...)`. Достижения всех мест работы загружаются одним запросом, а не запросом на каждое место работы;
- **набор DataLoader'ов создаётся на каждый запрос** (в GraphQL-контексте), поэтому кэш не утекает между запросами и пользователями.

Почему не `include` в одном запросе Prisma: `include` загружает все связи независимо от того, что запросил клиент, и плохо масштабируется, когда профилей в списке много. DataLoader даёт фиксированное число запросов при любом количестве записей.

### Модель данных

- Отдельные таблицы `Link`, `Skill`, `Project`, `Experience`, `Achievement` с внешними ключами на профиль (не JSON-поля): данные нормализованы, есть ссылочная целостность и индексы по `profileId` и `experienceId`.
- `sortOrder` задаёт порядок отображения, как в исходных данных.
- `startDate` и `endDate` хранятся как `DATE`. В API отдаются в формате `YYYY-MM`. `endDate = null` означает текущее место работы, такие записи идут первыми.
- `ON DELETE CASCADE`: при удалении профиля удаляются все связанные записи.

### Инициализация и заполнение БД

При каждом старте контейнера выполняется `npm run start:prod`:

1. `prisma migrate deploy` применяет миграции из git (безопасно для существующей БД, без генерации схемы на лету);
2. `prisma db seed` заполняет БД данными из `prisma/seed-data.ts`;
3. запускается сервер.

Seed **идемпотентен**: в одной транзакции удаляет профиль (связанные записи удаляются каскадом) и создаёт его заново. Перезапуск не создаёт дублей, а БД всегда соответствует `seed-data.ts`. Чтобы обновить визитку, достаточно поправить один файл и перезапустить приложение.

### Docker

- Многоэтапная сборка: в итоговом образе только production-зависимости и скомпилированный код. Процесс запускается от пользователя `node`, не от root.
- `docker-compose`: приложение ждёт healthcheck PostgreSQL (`pg_isready`), поэтому миграции не стартуют раньше базы.

### Apollo Sandbox в production

Визитку смотрят через Sandbox, поэтому landing page и introspection включены явно (по умолчанию Apollo отключает introspection при `NODE_ENV=production`). Данные публичные, мутаций нет.

## Тесты

E2E-тесты (Vitest + SWC) работают с настоящей PostgreSQL:

```bash
docker compose up -d db
cp .env.example .env
npm ci && npm run build
npx prisma migrate deploy && npx prisma db seed
npm run test:e2e
```

Что проверяется:

- запрос `profile` возвращает все вложенные данные из seed;
- **отсутствие N+1**: каждый репозиторий вызывается ровно один раз за запрос, в том числе для достижений всех мест работы;
- таблицы, поля которых не запрошены, не затрагиваются.

## Как добавить новое поле или сущность

`schema.prisma` → `npx prisma migrate dev --name <change>` → repository → service (+ loader) → model / resolver → `seed-data.ts`.
