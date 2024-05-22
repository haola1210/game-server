import { Injectable } from '@nestjs/common';
import { FormationUsageType } from '@prisma/client';
import { BaseNinja, InGameNinja } from 'src/classes';
import { getPosition } from 'src/constants';
import { LevelUpBonusStats } from 'src/interfaces';
import { PrismaService } from 'src/prisma.service';
import { CreatePlayerDto } from './dtos/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayer() {
    return this.prisma.player.findMany({
      include: {
        ninjas: true,
        formations: true,
      },
    });
  }

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const { name } = createPlayerDto;
    const newPlayer = await this.prisma.player.create({
      data: {
        name,
      },
    });

    return newPlayer;
  }

  async prepareTeam(id: string, formationType: FormationUsageType) {
    const data = await this.prisma.player.findUnique({
      where: {
        id,
      },
      include: {
        formations: {
          include: {
            usages: {
              where: {
                type: formationType,
              },
              include: {
                ninjasInFormations: {
                  include: {
                    refNinja: {
                      include: {
                        ninja: true,
                      },
                    },
                  },
                },
              },
            },
          },
          where: {
            usages: {
              some: {
                type: formationType,
              },
            },
          },
        },
      },
    });

    const ninjas = data.formations[0].usages[0].ninjasInFormations.map(
      (ninjaData) => {
        const position = getPosition(ninjaData.slot);
        const { id, level, star, grade } = ninjaData.refNinja; // this is owned ninja
        const ninjaInfo = ninjaData.refNinja.ninja;
        const baseNinja = new BaseNinja(
          id,
          ninjaInfo.name,
          ninjaInfo.tier,
          ninjaInfo.class,
          star,
          grade,
          ninjaInfo.attack,
          ninjaInfo.defense,
          ninjaInfo.healthPoint,
          ninjaInfo.critDamage,
          ninjaInfo.critRate,
          ninjaInfo.critResist,
          ninjaInfo.accuracy,
          ninjaInfo.dodge,
          ninjaInfo.pierce,
          ninjaInfo.toughness,
          ninjaInfo.damageAmplification,
          ninjaInfo.damageReduction,
          ninjaInfo.speed,
          ninjaInfo.specialLevelUpBonusStats as LevelUpBonusStats,
        );
        baseNinja.upLevelTo(level);
        return InGameNinja.converToInGameNinja(baseNinja, position, id);
      },
    );

    return ninjas;
  }
}
