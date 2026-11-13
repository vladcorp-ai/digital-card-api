import { Injectable } from '@nestjs/common';
import { Link, Profile } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findFirst(): Promise<Profile | null> {
    return this.prisma.profile.findFirst({ orderBy: { id: 'asc' } });
  }

  findLinksByProfileIds(profileIds: number[]): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: profileIds } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
