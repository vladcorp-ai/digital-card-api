import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { groupByKey } from '../graphql/group-by-key';
import { ProjectModel } from './project.model';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projects: ProjectRepository) {}

  /** Batches projects of all requested profiles into one query. */
  createByProfileLoader(): DataLoader<number, ProjectModel[]> {
    return new DataLoader(async (profileIds) => {
      const rows = await this.projects.findByProfileIds([...profileIds]);
      return groupByKey(profileIds, rows, (row) => row.profileId);
    });
  }
}
