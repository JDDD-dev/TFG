import { Test, TestingModule } from '@nestjs/testing';
import { DoctorResolver } from './doctor.resolver';
import { DoctorService } from './doctor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';

describe('DoctorResolver', () => {
  let resolver: DoctorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorResolver,
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useValue: {
            save: jest.fn().mockResolvedValue(resolver),
            find: jest.fn().mockResolvedValue([resolver]),
          },
        },
      ],
    }).compile();

    resolver = module.get<DoctorResolver>(DoctorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
