import { Test, TestingModule } from '@nestjs/testing';
import { HealthCenterResolver } from './health-center.resolver';
import { HealthCenterService } from './health-center.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HealthCenter } from './entities/health-center.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';

describe('HealthCenterResolver', () => {
  let resolver: HealthCenterResolver;
  let mockDoctor: DoctorService;
  let mockBeacon: BeaconsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCenterResolver,
        HealthCenterService,
        {
          provide: getRepositoryToken(HealthCenter),
          useValue: {
            save: jest.fn().mockResolvedValue(resolver),
            find: jest.fn().mockResolvedValue([resolver]),
          },
        },
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: {
            save: jest.fn().mockResolvedValue(mockDoctor),
            find: jest.fn().mockResolvedValue([mockDoctor]),
          },
        },
        BeaconsService,
        {
          provide: getRepositoryToken(Beacon),
          useValue: {
            save: jest.fn().mockResolvedValue(mockBeacon),
            find: jest.fn().mockResolvedValue([mockBeacon]),
          },
        },
      ],
    }).compile();

    resolver = module.get<HealthCenterResolver>(HealthCenterResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('add visitors', async () => {
    const aux = new HealthCenter();
    aux.id = 5;
    aux.personCounter = 5;
    const result = aux;
    jest
      .spyOn(HealthCenterService.prototype, 'addOneVisitor')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.addOneVisitor('test'))?.id).toBe(5);
  });

  it('get visitors', async () => {
    jest
      .spyOn(HealthCenterService.prototype, 'getVisitors')
      .mockImplementation(() => Promise.resolve(5));

    expect(await resolver.getVisitors('test')).toBe(5);
  });

  it('remove visitors', async () => {
    const aux = new HealthCenter();
    aux.id = 5;
    aux.personCounter = 5;
    const result = aux;
    jest
      .spyOn(HealthCenterService.prototype, 'removeOneVisitor')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.removeOneVisitor('test'))?.id).toBe(5);
  });
});
