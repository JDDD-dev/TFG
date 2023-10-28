import { Module } from '@nestjs/common';
import { BeaconsService } from './beacons.service';
import { BeaconsResolver } from './beacons.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Beacon } from './entities/beacon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Beacon])],
  providers: [BeaconsResolver, BeaconsService],
  exports: [BeaconsService],
})
export class BeaconsModule {}
