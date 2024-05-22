import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { MatchsModule } from './matchs/matchs.module';
import { EventsModule } from './events/events.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlayersModule,
    MatchsModule,
    EventsModule,
    RoomsModule,
  ],
})
export class AppModule {}
