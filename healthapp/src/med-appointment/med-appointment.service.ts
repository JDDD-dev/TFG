import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import * as moment from 'moment';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { User } from 'src/users/entities/user.entity';
import { Equal, LessThan, Repository } from 'typeorm';
import { CreateMedAppointmentInput } from './dto/create-med-appointment.input';
import { UpdateMedAppointmentInput } from './dto/update-med-appointment.input';
import { MedAppointment } from './entities/med-appointment.entity';

@Injectable()
export class MedAppointmentService {
  constructor(
    @InjectRepository(HealthCenter)
    private healthCenterRepository: Repository<HealthCenter>,
    @InjectRepository(MedAppointment)
    private medAppointmentRepository: Repository<MedAppointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Beacon)
    private beaconRepository: Repository<Beacon>,
  ) {}

  create(createMedAppointmentInput: CreateMedAppointmentInput) {
    return 'This action adds a new medAppointment';
  }

  findAll() {
    return `This action returns all medAppointment`;
  }

  findOne(id: number) {
    return this.medAppointmentRepository.findOneBy({ id: id });
  }

  update(id: number, updateMedAppointmentInput: UpdateMedAppointmentInput) {
    return `This action updates a #${id} medAppointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} medAppointment`;
  }

  async checkAppointment(username: string, idBeacon: string) {
    const beaconArr = await this.beaconRepository.find({
      where: {
        uuid: idBeacon,
      },
    });

    if (beaconArr.length === 0) {
      return null;
    }

    const userArr = await this.userRepository.find({
      where: {
        username: username,
      },
    });

    if (userArr.length === 0) {
      return null;
    }

    const beacon = beaconArr.at(0);
    const user = userArr.at(0);

    if (beacon && user) {
      const hCenter = beacon.hCenter;
      const appointment = await this.medAppointmentRepository.find({
        where: {
          pacient: user,
          center: hCenter,
          date: moment(Date.now()).format('DD/MM/YYYY'),
          ended: false,
        },
      });

      if (appointment.length > 0) {
        appointment[0].userRegistered = true;
        this.medAppointmentRepository.save(appointment[0]);
      }
      return appointment[0];
    } else {
      return null;
    }
  }

  async getNumberOfVisitorsInQueue(idMed: number) {
    const medAppointmentArr = await this.medAppointmentRepository.find({
      where: {
        id: idMed,
      },
    });

    if (medAppointmentArr.length === 0) {
      return null;
    }

    const medAppointment = medAppointmentArr.at(0);

    if (medAppointment) {
      const peopleBeforeInQueue = await this.medAppointmentRepository.find({
        where: [
          {
            center: medAppointment.center,
            userRegistered: true,
            ended: false,
            date: medAppointment.date,
            hour: LessThan(medAppointment.hour),
          },
          {
            center: medAppointment.center,
            userRegistered: true,
            ended: false,
            date: medAppointment.date,
            hour: Equal(medAppointment.hour),
            minute: LessThan(medAppointment.minute),
          },
        ],
      });
      return peopleBeforeInQueue.length;
    }

    return null;
  }

  async finishAppointment(
    id: number,
    recipeLink: string,
    justificantLink: string,
  ) {
    const medAppointmentArr = await this.medAppointmentRepository.find({
      where: {
        id: id,
      },
    });

    if (medAppointmentArr.length === 0) {
      return null;
    }

    const medAppointment = medAppointmentArr.at(0);

    console.log(recipeLink);
    if (medAppointment) {
      medAppointment.justificant = justificantLink;
      medAppointment.recipe = recipeLink;
      medAppointment.ended = true;
      this.medAppointmentRepository.save(medAppointment);

      const messages: ExpoPushMessage[] = [];
      const registerNotification: ExpoPushMessage = {
        to: medAppointment.pacient.expoPushToken,
        sound: 'default',
        body: 'You can view the details of the medical appointment in your account profile',
        title: 'Hope everything went Well!',
      };
      messages.push(registerNotification);
      const expo = new Expo();
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        const receipt = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipt);
      }
    }

    return medAppointment;
  }

  async getNotFinishedAppointment(username: string) {
    const medAppointments = await this.medAppointmentRepository.find({
      where: {
        doctor: { username: username },
        date: moment(Date.now()).format('DD/MM/YYYY'),
        ended: false,
      },
      relations: { pacient: true },
    });

    return medAppointments;
  }
}
