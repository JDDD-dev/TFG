import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedAppointmentService } from 'src/med-appointment/med-appointment.service';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import { HealthCenterService } from 'src/health-center/health-center.service';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let mockJwt: JwtService;
  let mockDoctor: DoctorService;
  let mockMedAppointment: MedAppointmentService;
  let mockCenter: HealthCenterService;
  let mockBeacon: BeaconsService;

  let usersRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(service),
            find: jest.fn().mockResolvedValue([service]),
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

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne', async () => {
    const aux = new User();
    aux.id = 6;

    jest.spyOn(usersRepository, 'find').mockReturnValue(Promise.resolve([aux]));

    expect((await service.findOne('test')).id).toBe(6);
  });
});
