import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MatchsModule } from 'src/matchs/matchs.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [MatchsModule, RoomsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
