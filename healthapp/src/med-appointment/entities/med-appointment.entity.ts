import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class MedAppointment {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'DB Entity Id' })
  id: number;

  @ManyToOne(() => User, (pacient) => pacient.medAppointment, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => User)
  pacient: User;

  @ManyToOne(() => HealthCenter, (center) => center.medAppointments)
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => HealthCenter)
  center: HealthCenter;

  @Field()
  @Column()
  date: string;

  @Field()
  @Column()
  hour: number;

  @Field()
  @Column()
  minute: number;

  @Field()
  @Column()
  place: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  userRegistered: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  ended: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recipe: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  justificant: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.medAppointments)
  @JoinColumn()
  @Field()
  doctor: Doctor;
}
