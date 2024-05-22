import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomsServices {
  constructor(private prisma: PrismaService) {}

  async getAllRoom() {
    const roomsWithMembers = await this.prisma.room.findMany({
      include: {
        playerRooms: {
          include: {
            player: true,
          },
        },
      },
    });

    const formattedRooms = roomsWithMembers.map((room) => ({
      id: room.id,
      name: room.name,
      players: room.playerRooms.map((playerRoom) => ({
        id: playerRoom.player.id,
        name: playerRoom.player.name,
      })),
    }));

    return formattedRooms;
  }

  async createRoom(playerId: string, roomData: { name: string }) {
    const newRoom = await this.prisma.room.create({
      data: {
        name: roomData.name,
      },
    });

    await this.prisma.playerRoom.create({
      data: {
        playerId: playerId,
        roomId: newRoom.id,
      },
    });

    const roomWithMembers = await this.prisma.room.findUnique({
      where: { id: newRoom.id },
      include: {
        playerRooms: {
          include: {
            player: true,
          },
        },
      },
    });

    const formattedRoom = {
      id: roomWithMembers.id,
      name: roomWithMembers.name,
      players: roomWithMembers.playerRooms.map((playerRoom) => ({
        id: playerRoom.player.id,
        name: playerRoom.player.name,
      })),
    };

    return formattedRoom;
  }
}
