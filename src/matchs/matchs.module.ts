import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { PlayersModule } from 'src/players/players.module';
import { MatchsController } from './matchs.controller';

@Module({
  imports: [PlayersModule],
  providers: [MatchsService],
  exports: [MatchsService],
  controllers: [MatchsController],
})
export class MatchsModule {}
