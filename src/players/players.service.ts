import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
}
