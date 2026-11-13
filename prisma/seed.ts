import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { seedData } from './seed-data';

const toDate = (yearMonth: string): Date => new Date(`${yearMonth}-01T00:00:00Z`);
const withOrder = <T>(items: T[]) => items.map((item, sortOrder) => ({ ...item, sortOrder }));

/**
 * Idempotent: replaces the card in one transaction, so the DB always mirrors seed-data.ts
 * and a restart never duplicates rows. Child rows are removed by ON DELETE CASCADE.
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  const { name, description, links, skills, experience, projects } = seedData;

  try {
    await prisma.$transaction([
      prisma.profile.deleteMany(),
      prisma.profile.create({
        data: {
          name,
          description,
          links: { create: withOrder(links) },
          skills: { create: withOrder(skills.map((skill) => ({ name: skill }))) },
          projects: { create: withOrder(projects) },
          experience: {
            create: experience.map((job) => ({
              company: job.company,
              position: job.position,
              startDate: toDate(job.startDate),
              endDate: job.endDate ? toDate(job.endDate) : null,
              achievements: { create: withOrder(job.achievements.map((text) => ({ text }))) },
            })),
          },
        },
      }),
    ]);
    console.log(`Seeded profile "${name}"`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
