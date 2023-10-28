import { CreateMedAppointmentInput } from './create-med-appointment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedAppointmentInput extends PartialType(
  CreateMedAppointmentInput,
) {
  @Field(() => Int)
  id: number;
}
