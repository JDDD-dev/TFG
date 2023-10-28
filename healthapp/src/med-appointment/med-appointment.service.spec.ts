import { Test, TestingModule } from '@nestjs/testing';
import { MedAppointmentService } from './med-appointment.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedAppointment } from './entities/med-appointment.entity';
import { HealthCenterService } from 'src/health-center/health-center.service';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { Repository } from 'typeorm';
import { MedAppointmentModule } from './med-appointment.module';

describe('MedAppointmentService', () => {
  let service: MedAppointmentService;
  let mockUser: UsersService;
  let mockJwt: JwtService;
  let mockDoctor: DoctorService;
  let mockMedAppointment: MedAppointmentService;
  let mockCenter: HealthCenterService;
  let mockBeacon: BeaconsService;

  let medAppointmentRepository: Repository<MedAppointment>;
  let beaconRepository: Repository<Beacon>;
  let usersRepository: Repository<User>;

  const APPOINTMENT_REPOSITORY_TOKEN = getRepositoryToken(MedAppointment);
  const BEACON_REPOSITORY_TOKEN = getRepositoryToken(Beacon);
  const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedAppointmentService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
          },
        },
        JwtService,
        {
          provide: getRepositoryToken(JwtService),
          useValue: {
            save: jest.fn().mockResolvedValue(mockJwt),
            find: jest.fn().mockResolvedValue([mockJwt]),
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
        MedAppointmentService,
        {
          provide: getRepositoryToken(MedAppointment),
          useValue: {
            save: jest.fn().mockResolvedValue(mockMedAppointment),
            find: jest.fn().mockResolvedValue([mockMedAppointment]),
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

    service = module.get<MedAppointmentService>(MedAppointmentService);
    medAppointmentRepository = module.get<Repository<MedAppointment>>(
      APPOINTMENT_REPOSITORY_TOKEN,
    );
    beaconRepository = module.get<Repository<Beacon>>(BEACON_REPOSITORY_TOKEN);
    usersRepository = module.get<Repository<User>>(USERS_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get visitors', async () => {
    const aux = new MedAppointment();
    aux.id = 5;

    jest
      .spyOn(medAppointmentRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));

    expect(await service.getNumberOfVisitorsInQueue(5)).toBe(1);
  });

  it('check appointment', async () => {
    const aux = new Beacon();
    aux.id = 5;
    const aux2 = new User();
    aux2.id = 6;
    const aux3 = new MedAppointment();
    aux3.id = 7;

    jest
      .spyOn(beaconRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));
    jest
      .spyOn(usersRepository, 'find')
      .mockReturnValue(Promise.resolve([aux2]));
    jest
      .spyOn(medAppointmentRepository, 'find')
      .mockReturnValue(Promise.resolve([aux3]));

    expect((await service.checkAppointment('test', 'test'))?.id).toBe(7);
  });

  it('finish appointment', async () => {
    const aux = new MedAppointment();
    aux.id = 7;
    const aux2 = new User();
    aux2.id = 5;
    aux2.expoPushToken = 'token';
    aux.pacient = aux2;

    jest
      .spyOn(medAppointmentRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));

    expect((await service.finishAppointment(7, 'test', 'test'))?.id).toBe(7);
  });

  it('not finished appointment', async () => {
    const aux = new MedAppointment();
    aux.id = 7;

    jest
      .spyOn(medAppointmentRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));

    expect((await service.getNotFinishedAppointment('test')).at(0)?.id).toBe(7);
  });
});
