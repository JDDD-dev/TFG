import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}
  create(createDoctorInput: CreateDoctorInput) {
    return 'This action adds a new doctor';
  }

  findAll() {
    return `This action returns all doctor`;
  }

  async findOne(username: string) {
    const result = await this.doctorsRepository.find({
      relations: { medAppointments: true },
      where: {
        username: username,
      },
    });
    return result[0];
  }

  update(id: number, updateDoctorInput: UpdateDoctorInput) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
