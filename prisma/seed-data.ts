/** The only place with personal data of the card. Edit here, restart the app — the DB is re-seeded. */
export interface SeedData {
  name: string;
  description: string;
  links: { title: string; url: string }[];
  skills: string[];
  experience: {
    company: string;
    position: string;
    /** YYYY-MM */
    startDate: string;
    /** YYYY-MM, omit for the current job */
    endDate?: string;
    achievements: string[];
  }[];
  projects: { name: string; url: string }[];
}

export const seedData: SeedData = {
  name: 'Vladimir Glukhov',
  description:
    'Full-stack developer with a backend focus (TypeScript, Node.js, PostgreSQL). ' +
    'I build and run complete products — from database schema to a live service: ' +
    'a services marketplace in production (mestro.uz), finance & booking SaaS. ' +
    'AI-assisted workflow with Claude Code; tests, deployment and support included. Tashkent, UTC+5.',
  links: [
    { title: 'GitHub', url: 'https://github.com/vladcorp-ai' },
    { title: 'LinkedIn', url: 'https://www.linkedin.com/in/vladimir-glukhov-dev' },
  ],
  skills: [
    'TypeScript',
    'Node.js',
    'NestJS',
    'Express',
    'GraphQL',
    'Prisma',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Git',
    'Railway',
    'Cloudflare Workers',
    'Python (FastAPI, Django)',
    'React',
    'Next.js',
    'Vitest / Jest / Playwright',
    'LLM APIs',
    'Claude Code',
  ],
  experience: [
    {
      company: 'VLADLAB LLC',
      position: 'Founder & Full-Stack Developer',
      startDate: '2025-09',
      achievements: [
        'Built and operate MasterUz (mestro.uz) — live AI-powered services marketplace: AI estimates job and price from a photo; web + Android, RU/UZ/EN, Telegram login and bot.',
        'Built RestoMetrics — finance & tax SaaS for SMBs: bank statement import, cash/bank reconciliation, monthly tax reports; multi-tenant PostgreSQL with row-level security.',
        'Built Fit Trainer — Telegram Mini App with AI workout generation and a B2B coach dashboard.',
        'Own the full cycle: product design, backend, frontend, AI integration, deployment (Railway, Cloudflare), support.',
      ],
    },
    {
      company: 'BSH Home Appliances (Bosch)',
      position: 'Retail Operations & Security Systems Specialist',
      startDate: '2020-01',
      endDate: '2025-12',
      achievements: [
        'Supervised 17 Bosch mono-brand stores across Uzbekistan; managed the opening of 10 new stores.',
        'Designed and rolled out CCTV and fire/security alarm systems for all branches; health & safety compliance.',
        'Weekly and monthly reporting, competitor and price analysis; B2B/B2C sales support.',
      ],
    },
  ],
  projects: [
    { name: 'MasterUz — AI services marketplace (live)', url: 'https://www.mestro.uz' },
    { name: 'MasterUz — product showcase', url: 'https://github.com/vladcorp-ai/masteruz-showcase' },
    { name: 'RestoMetrics — finance & tax SaaS', url: 'https://github.com/vladcorp-ai/restometrics-showcase' },
    { name: 'TimeRadar — booking & CRM SaaS (NestJS, Prisma)', url: 'https://github.com/vladcorp-ai/timeradar-showcase' },
    { name: 'Fit Trainer — AI fitness Telegram Mini App', url: 'https://github.com/vladcorp-ai/fit-trainer-showcase' },
    { name: 'telegram-webapp-auth — TypeScript library', url: 'https://github.com/vladcorp-ai/telegram-webapp-auth' },
    { name: 'Digital Card API — this project', url: 'https://github.com/vladcorp-ai/digital-card-api' },
  ],
};
