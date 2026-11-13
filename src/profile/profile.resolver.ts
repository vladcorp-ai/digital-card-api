import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExperienceModel } from '../experience/experience.model';
import { Loaders } from '../graphql/graphql-context';
import { ProjectModel } from '../project/project.model';
import { SkillModel } from '../skill/skill.model';
import { LinkModel } from './link.model';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => ProfileModel, { description: 'Owner of this digital business card' })
  profile(): Promise<ProfileModel> {
    return this.profiles.getProfile();
  }

  @ResolveField(() => [LinkModel])
  links(@Parent() profile: ProfileModel, @Context('loaders') loaders: Loaders): Promise<LinkModel[]> {
    return loaders.linksByProfile.load(profile.id);
  }

  @ResolveField(() => [SkillModel])
  skills(@Parent() profile: ProfileModel, @Context('loaders') loaders: Loaders): Promise<SkillModel[]> {
    return loaders.skillsByProfile.load(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  experience(
    @Parent() profile: ProfileModel,
    @Context('loaders') loaders: Loaders,
  ): Promise<ExperienceModel[]> {
    return loaders.experienceByProfile.load(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() profile: ProfileModel, @Context('loaders') loaders: Loaders): Promise<ProjectModel[]> {
    return loaders.projectsByProfile.load(profile.id);
  }
}
