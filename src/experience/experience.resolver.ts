import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Loaders } from '../graphql/graphql-context';
import { ExperienceModel } from './experience.model';

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  @ResolveField(() => [String])
  achievements(
    @Parent() experience: ExperienceModel,
    @Context('loaders') loaders: Loaders,
  ): Promise<string[]> {
    return loaders.achievementsByExperience.load(experience.id);
  }
}
