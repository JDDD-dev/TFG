import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HealthCenterService } from './health-center.service';
import { HealthCenter } from './entities/health-center.entity';
import { CreateHealthCenterInput } from './dto/create-health-center.input';
import { UpdateHealthCenterInput } from './dto/update-health-center.input';

@Resolver(() => HealthCenter)
export class HealthCenterResolver {
  constructor(private readonly healthCenterService: HealthCenterService) {}

  @Query(() => [HealthCenter], { name: 'healthCenter' })
  findAll() {
    return this.healthCenterService.findAll();
  }

  @Query(() => HealthCenter, { name: 'healthCenter', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.healthCenterService.findOne(id);
  }

  @Mutation(() => HealthCenter)
  async addOneVisitor(@Args('healthCenter') hCenter: string) {
    return await this.healthCenterService.addOneVisitor(hCenter);
  }

  @Mutation(() => HealthCenter)
  async removeOneVisitor(@Args('healthCenter') hCenter: string) {
    return await this.healthCenterService.removeOneVisitor(hCenter);
  }

  @Query(() => Number, { nullable: true })
  async getVisitors(@Args('doctorUser') username: string) {
    return await this.healthCenterService.getVisitors(username);
  }
}
