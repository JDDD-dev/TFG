import { ObjectType, Field, Int } from '@nestjs/graphql';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'DB Id' })
  id: number;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @ManyToOne(() => HealthCenter, (healthCenter) => healthCenter.doctors)
  @JoinColumn()
  @Field()
  healthCenter: HealthCenter;

  @OneToMany(() => MedAppointment, (medAppointments) => medAppointments.doctor)
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [MedAppointment])
  medAppointments: MedAppointment[];
}
