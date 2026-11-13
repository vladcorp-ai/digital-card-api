import { Field, ID, ObjectType } from '@nestjs/graphql';

/** Nested lists (links, skills, experience, projects) are resolved in ProfileResolver. */
@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;
}
