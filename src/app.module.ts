import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { RoomEventsGateway } from './socket/room.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlayersModule,
    RoomEventsGateway,
  ],
})
export class AppModule {}
