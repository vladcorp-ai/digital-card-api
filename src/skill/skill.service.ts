import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { groupByKey } from '../graphql/group-by-key';
import { SkillModel } from './skill.model';
import { SkillRepository } from './skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly skills: SkillRepository) {}

  /** Batches skills of all requested profiles into one query. */
  createByProfileLoader(): DataLoader<number, SkillModel[]> {
    return new DataLoader(async (profileIds) => {
      const rows = await this.skills.findByProfileIds([...profileIds]);
      return groupByKey(profileIds, rows, (row) => row.profileId);
    });
  }
}
