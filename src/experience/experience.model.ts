import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => ID)
  id!: number;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field({ description: 'Start of employment, YYYY-MM' })
  startDate!: string;

  @Field(() => String, { nullable: true, description: 'End of employment, YYYY-MM; null means current job' })
  endDate!: string | null;
}
