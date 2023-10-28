import { Resolver, Query, Args } from '@nestjs/graphql';
import { BeaconsService } from './beacons.service';
import { Beacon } from './entities/beacon.entity';

@Resolver(() => Beacon)
export class BeaconsResolver {
  constructor(private readonly beaconsService: BeaconsService) {}

  @Query(() => [Beacon], { name: 'beacons' })
  findAll() {
    return this.beaconsService.findAll();
  }

  @Query(() => Beacon, { name: 'beaconOne', nullable: true })
  async findOne(@Args('beaconUUID') beaconUUID: string) {
    const result = await this.beaconsService.findOne(beaconUUID);
    console.log(result[0]);
    return result[0];
  }
}
