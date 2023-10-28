import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from './doctor/doctor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Doctor } from './doctor/entities/doctor.entity';
import { MedAppointmentService } from './med-appointment/med-appointment.service';
import { MedAppointment } from './med-appointment/entities/med-appointment.entity';
import { HealthCenterService } from './health-center/health-center.service';
import { HealthCenter } from './health-center/entities/health-center.entity';
import { BeaconsService } from './beacons/beacons.service';
import { Beacon } from './beacons/entities/beacon.entity';

describe('AppController', () => {
  let appController: AppController;
  let mockUser: UsersService;
  let mockJwt: JwtService;
  let mockDoctor: DoctorService;
  let mockMedAppointment: MedAppointmentService;
  let mockCenter: HealthCenterService;
  let mockBeacon: BeaconsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Respuesta de ejemplo"', async () => {
      expect(await appController.testEndpoint()).toBe('Respuesta de ejemplo');
    });
  });
});
