import DataLoader from 'dataloader';
import { ExperienceModel } from '../experience/experience.model';
import { LinkModel } from '../profile/link.model';
import { ProjectModel } from '../project/project.model';
import { SkillModel } from '../skill/skill.model';

/** Per-request DataLoaders: a fresh set per request, so cache never leaks between requests. */
export interface Loaders {
  linksByProfile: DataLoader<number, LinkModel[]>;
  skillsByProfile: DataLoader<number, SkillModel[]>;
  experienceByProfile: DataLoader<number, ExperienceModel[]>;
  achievementsByExperience: DataLoader<number, string[]>;
  projectsByProfile: DataLoader<number, ProjectModel[]>;
}

export interface GraphqlContext {
  loaders: Loaders;
}
