import { Test, TestingModule } from '@nestjs/testing';
import { MedAppointmentResolver } from './med-appointment.resolver';
import { MedAppointmentService } from './med-appointment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedAppointment } from './entities/med-appointment.entity';
import { HealthCenterService } from 'src/health-center/health-center.service';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';

describe('MedAppointmentResolver', () => {
  let resolver: MedAppointmentResolver;
  let mockCenter: HealthCenter;
  let mockUser: UsersService;
  let mockBeacon: BeaconsService;
  let mockDoctor: DoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedAppointmentResolver,
        MedAppointmentService,
        {
          provide: getRepositoryToken(MedAppointment),
          useValue: {
            save: jest.fn().mockResolvedValue(resolver),
            find: jest.fn().mockResolvedValue([resolver]),
          },
        },
        HealthCenterService,
        {
          provide: getRepositoryToken(HealthCenter),
          useValue: {
            save: jest.fn().mockResolvedValue(mockCenter),
            find: jest.fn().mockResolvedValue([mockCenter]),
          },
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
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
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: {
            save: jest.fn().mockResolvedValue(mockDoctor),
            find: jest.fn().mockResolvedValue([mockDoctor]),
          },
        },
      ],
    }).compile();

    resolver = module.get<MedAppointmentResolver>(MedAppointmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('number in queue', async () => {
    const result = 3;
    jest
      .spyOn(MedAppointmentService.prototype, 'getNumberOfVisitorsInQueue')
      .mockImplementation(() => Promise.resolve(result));

    expect(await resolver.numberOfVisitorInQueue(1)).toBe(3);
  });

  it('not finished appointments', async () => {
    const aux = new MedAppointment();
    aux.id = 5;
    const result = [aux];
    jest
      .spyOn(MedAppointmentService.prototype, 'getNotFinishedAppointment')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.getNotFinishedAppointment('test')).at(0)?.id).toBe(
      5,
    );
  });

  it('finish appointments', async () => {
    const aux = new MedAppointment();
    aux.id = 5;
    const result = aux;
    jest
      .spyOn(MedAppointmentService.prototype, 'finishAppointment')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.finishAppointment(1, 'test', 'test'))?.id).toBe(5);
  });

  it('check existence of an appointment', async () => {
    const aux = new MedAppointment();
    aux.id = 5;
    const result = aux;
    jest
      .spyOn(MedAppointmentService.prototype, 'checkAppointment')
      .mockImplementation(() => Promise.resolve(result));

    expect((await resolver.checkAppointment('test', 'test'))?.id).toBe(5);
  });
});
