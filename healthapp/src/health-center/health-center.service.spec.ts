import { Test, TestingModule } from '@nestjs/testing';
import { HealthCenterService } from './health-center.service';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedAppointmentService } from 'src/med-appointment/med-appointment.service';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { HealthCenter } from './entities/health-center.entity';
import { Repository } from 'typeorm';

describe('HealthCenterService', () => {
  let service: HealthCenterService;
  let mockUser: UsersService;
  let mockJwt: JwtService;
  let mockMedAppointment: MedAppointmentService;
  let mockBeacon: BeaconsService;
  let mockDoctor: DoctorService;

  let healthCenterRepository: Repository<HealthCenter>;
  let beaconRepository: Repository<Beacon>;
  let doctorRepository: Repository<Doctor>;

  const HEALTH_REPOSITORY_TOKEN = getRepositoryToken(HealthCenter);
  const BEACON_REPOSITORY_TOKEN = getRepositoryToken(Beacon);
  const DOCTOR_REPOSITORY_TOKEN = getRepositoryToken(Doctor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCenterService,
        {
          provide: getRepositoryToken(HealthCenter),
          useValue: {
            save: jest.fn().mockResolvedValue(service),
            find: jest.fn().mockResolvedValue([service]),
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

    service = module.get<HealthCenterService>(HealthCenterService);
    healthCenterRepository = module.get<Repository<HealthCenter>>(
      HEALTH_REPOSITORY_TOKEN,
    );
    beaconRepository = module.get<Repository<Beacon>>(BEACON_REPOSITORY_TOKEN);
    doctorRepository = module.get<Repository<Doctor>>(DOCTOR_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('remove visitors', async () => {
    const aux = new Beacon();
    aux.id = 5;
    aux.uuid = 'test';
    const aux2 = new HealthCenter();
    aux2.id = 6;
    aux2.personCounter = 2;
    aux.hCenter = aux2;

    jest
      .spyOn(beaconRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));
    jest
      .spyOn(healthCenterRepository, 'save')
      .mockReturnValue(Promise.resolve(aux2));

    expect((await service.removeOneVisitor('test'))?.personCounter).toBe(1);
  });

  it('add visitors', async () => {
    const aux = new Beacon();
    aux.id = 5;
    aux.uuid = 'test';
    const aux2 = new HealthCenter();
    aux2.id = 6;
    aux2.personCounter = 2;
    aux.hCenter = aux2;

    jest
      .spyOn(beaconRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));
    jest
      .spyOn(healthCenterRepository, 'save')
      .mockReturnValue(Promise.resolve(aux2));

    expect((await service.addOneVisitor('test'))?.personCounter).toBe(3);
  });

  it('get visitors', async () => {
    const aux = new Doctor();
    const aux2 = new HealthCenter();
    aux2.id = 6;
    aux2.personCounter = 2;
    aux.healthCenter = aux2;

    jest
      .spyOn(doctorRepository, 'find')
      .mockReturnValue(Promise.resolve([aux]));

    expect(await service.getVisitors('test')).toBe(2);
  });
});
