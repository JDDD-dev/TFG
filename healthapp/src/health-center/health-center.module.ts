import { Module } from '@nestjs/common';
import { HealthCenterService } from './health-center.service';
import { HealthCenterResolver } from './health-center.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCenter } from './entities/health-center.entity';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCenter, Beacon, Doctor])],
  providers: [HealthCenterService, HealthCenterResolver],
  exports: [HealthCenterService],
})
export class HealthCenterModule {}
