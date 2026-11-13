import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Link', { description: 'Professional resource: GitHub, LinkedIn, etc.' })
export class LinkModel {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  url!: string;
}
