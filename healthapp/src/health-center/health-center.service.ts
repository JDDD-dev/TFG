import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Repository } from 'typeorm';
import { CreateHealthCenterInput } from './dto/create-health-center.input';
import { UpdateHealthCenterInput } from './dto/update-health-center.input';
import { HealthCenter } from './entities/health-center.entity';

@Injectable()
export class HealthCenterService {
  constructor(
    @InjectRepository(HealthCenter)
    private healthCenterRepository: Repository<HealthCenter>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Beacon)
    private beaconRepository: Repository<Beacon>,
  ) {}

  create(createHealthCenterInput: CreateHealthCenterInput) {
    return 'This action adds a new healthCenter';
  }

  findAll() {
    return `This action returns all healthCenter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthCenter`;
  }

  update(id: number, updateHealthCenterInput: UpdateHealthCenterInput) {
    return `This action updates a #${id} healthCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthCenter`;
  }

  async addOneVisitor(idBeacon: string) {
    const beacon = (
      await this.beaconRepository.find({
        relations: { hCenter: true },
        where: { uuid: idBeacon },
      })
    )[0];

    if (beacon) {
      const hCenter = beacon.hCenter;
      hCenter.personCounter = hCenter.personCounter + 1;
      const hCenterSaved = await this.healthCenterRepository.save(hCenter);
      return hCenterSaved;
    }

    return null;
  }

  async removeOneVisitor(idBeacon: string) {
    const beacon = (
      await this.beaconRepository.find({
        relations: { hCenter: true },
        where: { uuid: idBeacon },
      })
    )[0];

    if (beacon) {
      const hCenter = beacon.hCenter;
      hCenter.personCounter = hCenter.personCounter - 1;
      const hCenterSaved = await this.healthCenterRepository.save(hCenter);
      return hCenterSaved;
    }

    return null;
  }

  async getVisitors(username: string) {
    const doctor = (
      await this.doctorRepository.find({
        relations: {
          healthCenter: true,
        },
        where: {
          username: username,
        },
      })
    )[0];

    if (doctor) {
      return doctor.healthCenter.personCounter;
    }

    return null;
  }
}
