import { CreateHealthCenterInput } from './create-health-center.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHealthCenterInput extends PartialType(
  CreateHealthCenterInput,
) {
  @Field(() => Int)
  id: number;
}
