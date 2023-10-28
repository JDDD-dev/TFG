import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHealthCenterInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
