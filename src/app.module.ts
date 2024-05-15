import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { RoomEventsGateway } from './socket/room.gateway';
import { MatchsModule } from './matchs/matchs.module';
import { EventsModule } from './events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/ui',
    }),
    PrismaModule,
    PlayersModule,
    RoomEventsGateway,
    MatchsModule,
    EventsModule,
  ],
})
export class AppModule {}
