import { FormationUsageType } from '@prisma/client';
import { PlayersService } from './../players/players.service';
import { Injectable } from '@nestjs/common';
import { Match } from 'src/classes';

@Injectable()
export class MatchsService {
  constructor(private playersService: PlayersService) {}

  async generateSoloMatch(player1Id: string, player2Id: string) {
    const [player1Ninjas, player2Ninjas] = await Promise.all([
      this.playersService.prepareTeam(player1Id, FormationUsageType.ATTACK),
      this.playersService.prepareTeam(player2Id, FormationUsageType.ATTACK),
    ]);

    const match = new Match(player1Ninjas, player2Ninjas);
    return match;
  }
}
