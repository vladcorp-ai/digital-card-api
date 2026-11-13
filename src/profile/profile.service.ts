import { Injectable, NotFoundException } from '@nestjs/common';
import DataLoader from 'dataloader';
import { groupByKey } from '../graphql/group-by-key';
import { LinkModel } from './link.model';
import { ProfileModel } from './profile.model';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  async getProfile(): Promise<ProfileModel> {
    const profile = await this.profiles.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile is not seeded yet');
    }
    return profile;
  }

  /** Batches links of all requested profiles into one query. */
  createLinksLoader(): DataLoader<number, LinkModel[]> {
    return new DataLoader(async (profileIds) => {
      const rows = await this.profiles.findLinksByProfileIds([...profileIds]);
      return groupByKey(profileIds, rows, (row) => row.profileId);
    });
  }
}
