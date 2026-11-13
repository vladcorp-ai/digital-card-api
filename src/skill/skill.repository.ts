import { Injectable } from '@nestjs/common';
import { Skill } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: number[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: profileIds } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
