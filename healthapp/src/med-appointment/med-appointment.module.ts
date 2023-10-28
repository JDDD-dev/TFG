import { Module } from '@nestjs/common';
import { MedAppointmentService } from './med-appointment.service';
import { MedAppointmentResolver } from './med-appointment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedAppointment } from './entities/med-appointment.entity';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { User } from 'src/users/entities/user.entity';
import { Beacon } from 'src/beacons/entities/beacon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedAppointment, HealthCenter, User, Beacon]),
  ],
  providers: [MedAppointmentService, MedAppointmentResolver],
  exports: [MedAppointmentService],
})
export class MedAppointmentModule {}
