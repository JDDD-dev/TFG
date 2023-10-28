import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBeaconInput } from './dto/create-beacon.input';
import { UpdateBeaconInput } from './dto/update-beacon.input';
import { Beacon } from './entities/beacon.entity';

@Injectable()
export class BeaconsService {
  constructor(
    @InjectRepository(Beacon)
    private beaconRepository: Repository<Beacon>,
  ) {}

  create(createBeaconInput: CreateBeaconInput) {
    return 'This action adds a new beacon';
  }

  findAll() {
    return `This action returns all beacons`;
  }

  async findOne(beaconUUID: string) {
    return await this.beaconRepository.find({
      relations: { hCenter: true },
      where: {
        uuid: beaconUUID,
      },
    });
  }

  update(id: number, updateBeaconInput: UpdateBeaconInput) {
    return `This action updates a #${id} beacon`;
  }

  remove(id: number) {
    return `This action removes a #${id} beacon`;
  }
}
