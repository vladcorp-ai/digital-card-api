import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node dist/prisma/seed.js',
  },
  datasource: {
    // Not required for `prisma generate` (Docker build stage has no DB).
    url: process.env.DATABASE_URL,
  },
});
