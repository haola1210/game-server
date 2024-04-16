import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlayersModule,
  ],
})
export class AppModule {}
