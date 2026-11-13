import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { seedData } from '../prisma/seed-data';
import { AppModule } from '../src/app.module';
import { ExperienceRepository } from '../src/experience/experience.repository';
import { ProfileRepository } from '../src/profile/profile.repository';
import { ProjectRepository } from '../src/project/project.repository';
import { SkillRepository } from '../src/skill/skill.repository';

/** Requires a migrated and seeded DB (see README → Tests). */
describe('profile query (e2e)', () => {
  let app: INestApplication;

  const query = `{
    profile {
      name
      description
      links { title url }
      skills { name }
      experience { company position startDate endDate achievements }
      projects { name url }
    }
  }`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the seeded profile with all nested data', async () => {
    const res = await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200);
    const { profile } = res.body.data;

    expect(profile.name).toBe(seedData.name);
    expect(profile.links).toHaveLength(seedData.links.length);
    expect(profile.skills.map((s: { name: string }) => s.name)).toEqual(seedData.skills);
    expect(profile.projects).toHaveLength(seedData.projects.length);
    expect(profile.experience).toHaveLength(seedData.experience.length);
    for (const job of profile.experience) {
      const seeded = seedData.experience.find((e) => e.company === job.company)!;
      expect(job.startDate).toBe(seeded.startDate);
      expect(job.endDate).toBe(seeded.endDate ?? null);
      expect(job.achievements).toEqual(seeded.achievements);
    }
  });

  it('loads each nested list with a single batched query (no N+1)', async () => {
    const spies = [
      vi.spyOn(app.get(ProfileRepository), 'findLinksByProfileIds'),
      vi.spyOn(app.get(SkillRepository), 'findByProfileIds'),
      vi.spyOn(app.get(ExperienceRepository), 'findByProfileIds'),
      vi.spyOn(app.get(ExperienceRepository), 'findAchievementsByExperienceIds'),
      vi.spyOn(app.get(ProjectRepository), 'findByProfileIds'),
    ];

    await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200);

    // Achievements of every job are fetched at once, not one query per job.
    for (const spy of spies) {
      expect(spy).toHaveBeenCalledTimes(1);
    }
  });

  it('does not touch tables of fields that were not requested', async () => {
    const skills = vi.spyOn(app.get(SkillRepository), 'findByProfileIds');
    skills.mockClear();

    await request(app.getHttpServer()).post('/graphql').send({ query: '{ profile { name } }' }).expect(200);

    expect(skills).not.toHaveBeenCalled();
  });
});
