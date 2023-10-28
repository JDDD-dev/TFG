import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'User username' })
  username: string;

  @Field({ description: 'User password' })
  password: string;
}
