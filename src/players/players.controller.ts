import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';
import { FormationUsageType } from '@prisma/client';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('all')
  getAll() {
    return this.playersService.getAllPlayer();
  }

  @Get(':id/prepare/:formationType')
  prepareData(
    @Param('id') id: string,
    @Param('formationType') formationType: FormationUsageType,
  ) {
    return this.playersService.prepareTeam(id, formationType);
  }
}
