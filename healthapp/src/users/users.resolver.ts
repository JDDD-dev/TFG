import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqlguard';
import { RegisterTokenInput } from './dto/registerToken-user.input';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  //@UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('username', { type: () => String }) username: string) {
    return this.usersService.findOne(username);
  }

  @Mutation(() => User)
  async registerToken(
    @Args('registerTokenInput') registerTokenInput: RegisterTokenInput,
  ) {
    const updateResult = await this.usersService.update(
      registerTokenInput.username,
      registerTokenInput,
    );
    if (registerTokenInput.expoPushToken !== null) {
      const messages: ExpoPushMessage[] = [];
      const registerNotification: ExpoPushMessage = {
        to: registerTokenInput.expoPushToken,
        sound: 'default',
        body: 'You will receive all your Push Notifications in this Device',
        title: 'Device Registered!',
      };
      messages.push(registerNotification);
      const expo = new Expo();
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        const receipt = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipt);
      }
    }
    return updateResult;
  }

  @Query(() => User, { nullable: true })
  async callEmergency(@Args('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (user) {
      const contacts = user.emergencyContacts;
      for (const userOne of contacts) {
        if (userOne.expoPushToken !== null) {
          const messages: ExpoPushMessage[] = [];
          const registerNotification: ExpoPushMessage = {
            to: userOne.expoPushToken,
            sound: 'default',
            body: 'An emergency has been detected with ' + username,
            title: 'EMERGENCY!',
          };
          messages.push(registerNotification);
          const expo = new Expo();
          const chunks = expo.chunkPushNotifications(messages);
          for (const chunk of chunks) {
            const receipt = await expo.sendPushNotificationsAsync(chunk);
            console.log(receipt);
          }
        }
      }
      return user;
    } else {
      return null;
    }
  }
}
