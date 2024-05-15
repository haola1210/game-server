import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MatchsModule } from 'src/matchs/matchs.module';

@Module({
  imports: [MatchsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
