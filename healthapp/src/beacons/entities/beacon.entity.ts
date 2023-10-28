import { ObjectType, Field, Int } from '@nestjs/graphql';
import { HealthCenter } from 'src/health-center/entities/health-center.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Beacon {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'DB Entity Id' })
  id: number;

  @Column()
  @Field()
  uuid: string;

  @OneToOne(() => HealthCenter, { nullable: true })
  @JoinColumn()
  // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-unused-vars
  @Field(type => HealthCenter, {  nullable: true })
  hCenter: HealthCenter;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isEmergencyVehicule: boolean;
}
