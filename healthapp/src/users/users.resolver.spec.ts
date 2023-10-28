import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(usersService),
            find: jest.fn().mockResolvedValue([usersService]),
          },
        },
      ],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  it('find All', async () => {
    const aux = new User();
    aux.id = 5;
    const result = [aux];
    jest
      .spyOn(UsersService.prototype, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    expect((await usersResolver.findAll()).at(0)?.id).toBe(5);
  });

  it('register token', async () => {
    const aux = new User();
    aux.id = 5;
    const result = aux;
    aux.expoPushToken = 'token';
    const aux2 = new UpdateUserInput();
    aux2.expoPushToken = 'token';
    aux2.username = 'test';
    jest
      .spyOn(UsersService.prototype, 'update')
      .mockImplementation(() => Promise.resolve(result));

    expect((await usersResolver.registerToken(aux2))?.expoPushToken).toBe(
      'token',
    );
  });

  it('call emergency', async () => {
    const aux = new User();
    aux.id = 5;
    const result = aux;
    aux.expoPushToken = 'token';
    aux.emergencyContacts = [];
    const aux2 = new UpdateUserInput();
    aux2.expoPushToken = 'token';
    aux2.username = 'test';
    jest
      .spyOn(UsersService.prototype, 'findOne')
      .mockImplementation(() => Promise.resolve(result));

    expect((await usersResolver.callEmergency('test'))?.id).toBe(5);
  });
});
