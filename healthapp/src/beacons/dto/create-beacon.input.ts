import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBeaconInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
