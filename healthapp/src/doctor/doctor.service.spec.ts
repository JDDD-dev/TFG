import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MedAppointmentService } from 'src/med-appointment/med-appointment.service';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import { HealthCenterService } from 'src/health-center/health-center.service';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { BeaconsService } from 'src/beacons/beacons.service';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { Doctor } from './entities/doctor.entity';

describe('DoctorService', () => {
  let service: DoctorService;
  let mockUser: UsersService;
  let mockJwt: JwtService;
  let mockMedAppointment: MedAppointmentService;
  let mockCenter: HealthCenterService;
  let mockBeacon: BeaconsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
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

    service = module.get<DoctorService>(DoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
