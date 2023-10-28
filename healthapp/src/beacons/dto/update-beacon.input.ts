import { CreateBeaconInput } from './create-beacon.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBeaconInput extends PartialType(CreateBeaconInput) {
  @Field(() => Int)
  id: number;
}
