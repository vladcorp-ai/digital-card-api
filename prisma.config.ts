import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// Local runs read .env; in Docker/Railway variables come from the environment.
if (existsSync('.env')) process.loadEnvFile('.env');

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
