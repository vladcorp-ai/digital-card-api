import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Experience } from '../generated/prisma/client';
import { groupByKey } from '../graphql/group-by-key';
import { ExperienceModel } from './experience.model';
import { ExperienceRepository } from './experience.repository';

@Injectable()
export class ExperienceService {
  constructor(private readonly experience: ExperienceRepository) {}

  /** Batches work experience of all requested profiles into one query. */
  createByProfileLoader(): DataLoader<number, ExperienceModel[]> {
    return new DataLoader(async (profileIds) => {
      const rows = await this.experience.findByProfileIds([...profileIds]);
      return groupByKey(profileIds, rows, (row) => row.profileId).map((group) =>
        group.map((row) => this.toModel(row)),
      );
    });
  }

  /** Batches achievements of all requested jobs into one query. */
  createAchievementsLoader(): DataLoader<number, string[]> {
    return new DataLoader(async (experienceIds) => {
      const rows = await this.experience.findAchievementsByExperienceIds([...experienceIds]);
      return groupByKey(experienceIds, rows, (row) => row.experienceId).map((group) =>
        group.map((row) => row.text),
      );
    });
  }

  private toModel(row: Experience): ExperienceModel {
    return {
      id: row.id,
      company: row.company,
      position: row.position,
      startDate: toYearMonth(row.startDate),
      endDate: row.endDate ? toYearMonth(row.endDate) : null,
    };
  }
}

function toYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}
