import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Beacon } from 'src/beacons/entities/beacon.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class HealthCenter {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'DB Entity Id' })
  id: number;

  @Column()
  @Field()
  mapUrl: string;

  @OneToOne(() => Beacon)
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => Beacon)
  beacon: Beacon;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isHospital: string;

  @Column()
  @Field()
  personCounter: number;

  @OneToMany(() => Doctor, (doctors) => doctors.healthCenter)
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [Doctor])
  doctors: Doctor[];

  @OneToMany(() => MedAppointment, (medAppointments) => medAppointments.center)
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [MedAppointment])
  medAppointments: MedAppointment[];
}
