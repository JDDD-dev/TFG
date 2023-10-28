import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from 'src/doctor/doctor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedAppointmentService } from 'src/med-appointment/med-appointment.service';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import { HealthCenterService } from 'src/health-center/health-center.service';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: UsersService;
  let mockJwt: JwtService;
  let mockDoctor: DoctorService;
  let mockMedAppointment: MedAppointmentService;
  let mockCenter: HealthCenterService;
  let mockBeacon: BeaconsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
