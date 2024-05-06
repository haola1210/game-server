import { MatchsService } from './matchs.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('matchs')
export class MatchsController {
  constructor(private matchsService: MatchsService) {}

  @Get('solo/:player1/:player2')
  getSoloMatch(
    @Param('player1') player1: string,
    @Param('player2') player2: string,
  ) {
    return this.matchsService.generateSoloMatch(player1, player2);
  }
}
