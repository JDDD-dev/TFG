import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedAppointmentService } from './med-appointment.service';
import { MedAppointment } from './entities/med-appointment.entity';
import { CreateMedAppointmentInput } from './dto/create-med-appointment.input';
import { UpdateMedAppointmentInput } from './dto/update-med-appointment.input';

@Resolver(() => MedAppointment)
export class MedAppointmentResolver {
  constructor(private readonly medAppointmentService: MedAppointmentService) {}

  @Query(() => [MedAppointment], { name: 'medAppointmentAll' })
  findAll() {
    return this.medAppointmentService.findAll();
  }

  @Query(() => MedAppointment, { name: 'medAppointmentOne', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.medAppointmentService.findOne(id);
  }

  @Query(() => MedAppointment, { name: 'medAppointment', nullable: true })
  async checkAppointment(
    @Args('username') username: string,
    @Args('beaconUUID') beaconUUID: string,
  ) {
    return await this.medAppointmentService.checkAppointment(
      username,
      beaconUUID,
    );
  }

  @Query(() => Number)
  numberOfVisitorInQueue(@Args('id', { type: () => Int }) id: number) {
    return this.medAppointmentService.getNumberOfVisitorsInQueue(id);
  }

  @Mutation(() => MedAppointment)
  finishAppointment(
    @Args('id', { type: () => Int }) id: number,
    @Args('recipe') recipeLink: string,
    @Args('justificant') justificantLink: string,
  ) {
    return this.medAppointmentService.finishAppointment(
      id,
      recipeLink,
      justificantLink,
    );
  }

  @Query(() => [MedAppointment])
  getNotFinishedAppointment(@Args('username') username: string) {
    return this.medAppointmentService.getNotFinishedAppointment(username);
  }
}
