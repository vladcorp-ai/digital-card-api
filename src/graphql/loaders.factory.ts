import { Injectable } from '@nestjs/common';
import { ExperienceService } from '../experience/experience.service';
import { ProfileService } from '../profile/profile.service';
import { ProjectService } from '../project/project.service';
import { SkillService } from '../skill/skill.service';
import { Loaders } from './graphql-context';

@Injectable()
export class LoadersFactory {
  constructor(
    private readonly profiles: ProfileService,
    private readonly skills: SkillService,
    private readonly experience: ExperienceService,
    private readonly projects: ProjectService,
  ) {}

  create(): Loaders {
    return {
      linksByProfile: this.profiles.createLinksLoader(),
      skillsByProfile: this.skills.createByProfileLoader(),
      experienceByProfile: this.experience.createByProfileLoader(),
      achievementsByExperience: this.experience.createAchievementsLoader(),
      projectsByProfile: this.projects.createByProfileLoader(),
    };
  }
}
