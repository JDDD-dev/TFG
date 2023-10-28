import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMedAppointmentInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
