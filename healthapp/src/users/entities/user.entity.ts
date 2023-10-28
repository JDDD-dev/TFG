import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MedAppointment } from 'src/med-appointment/entities/med-appointment.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'DB Entity Id' })
  id: number;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  username: string;

  @Column()
  password: string;

  @Column()
  @Field()
  city: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  expoPushToken: string;

  @ManyToMany(() => User)
  @JoinTable()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [User])
  emergencyContacts: User[];

  @OneToMany(() => MedAppointment, (medAppointment) => medAppointment.pacient)
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [MedAppointment])
  medAppointment: MedAppointment[];

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => [User], { nullable: true })
  partner: User[];

  @Column({ default: false })
  @Field({ defaultValue: false })
  inHospital: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  hospitalData: string;
}
