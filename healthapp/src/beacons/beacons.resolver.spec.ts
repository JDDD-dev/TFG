import { Test, TestingModule } from '@nestjs/testing';
import { BeaconsResolver } from './beacons.resolver';
import { BeaconsService } from './beacons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Beacon } from './entities/beacon.entity';

describe('BeaconsResolver', () => {
  let resolver: BeaconsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeaconsResolver,
        BeaconsService,
        {
          provide: getRepositoryToken(Beacon),
          useValue: {
            save: jest.fn().mockResolvedValue(resolver),
            find: jest.fn().mockResolvedValue([resolver]),
          },
        },
      ],
    }).compile();

    resolver = module.get<BeaconsResolver>(BeaconsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('find One', async () => {
    const aux = new Beacon();
    aux.id = 5;
    const result = [aux];
    jest
      .spyOn(BeaconsService.prototype, 'findOne')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.findOne('test'))?.id).toBe(5);
  });
});
