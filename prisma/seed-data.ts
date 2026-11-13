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
  name: 'TODO: Имя Фамилия',
  description: 'TODO: TypeScript backend developer.',
  links: [{ title: 'GitHub', url: 'https://github.com/vladcorp-ai' }],
  skills: ['TypeScript', 'Node.js', 'NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker', 'Git'],
  experience: [
    {
      company: 'TODO: Company',
      position: 'TODO: Backend Developer',
      startDate: '2023-01',
      achievements: ['TODO: achievement 1', 'TODO: achievement 2'],
    },
    {
      company: 'TODO: Previous company',
      position: 'TODO: Developer',
      startDate: '2021-03',
      endDate: '2022-12',
      achievements: ['TODO: achievement'],
    },
  ],
  projects: [{ name: 'Digital business card API', url: 'https://github.com/vladcorp-ai/digital-card-api' }],
};
