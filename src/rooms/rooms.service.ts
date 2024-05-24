import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getRoomById(id: number) {
    const roomWithMembers = await this.prisma.room.findUnique({
      where: { id },
      include: {
        playerRooms: {
          include: {
            player: true,
          },
        },
      },
    });

    const formattedRoom = roomFormatter(roomWithMembers);

    return formattedRoom;
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

    const formattedRoom = roomFormatter(roomWithMembers);

    return formattedRoom;
  }

  async joinRoom(playerId: string, roomId: number) {
    const roomExists = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!roomExists) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    const memberCount = await this.prisma.playerRoom.count({
      where: { roomId: roomId },
    });

    if (memberCount >= 2) {
      throw new BadRequestException(
        `Room with id ${roomId} already has 2 members`,
      );
    }

    await this.prisma.playerRoom.create({
      data: {
        playerId: playerId,
        roomId: roomId,
      },
    });

    const roomWithMembers = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        playerRooms: {
          include: {
            player: true,
          },
        },
      },
    });
    const formattedRoom = roomFormatter(roomWithMembers);

    return formattedRoom;
  }

  async leaveRoom(playerId: string, roomId: number) {
    const playerInRoom = await this.prisma.playerRoom.findUnique({
      where: {
        playerId,
        roomId,
      },
    });

    if (!playerInRoom) {
      throw new NotFoundException(
        `Player with id ${playerId} is not in room with id ${roomId}`,
      );
    }

    await this.prisma.playerRoom.delete({
      where: {
        playerId,
        roomId,
      },
    });

    // Kiểm tra số lượng thành viên còn lại trong phòng
    const remainingMembers = await this.prisma.playerRoom.count({
      where: { roomId: roomId },
    });

    if (remainingMembers === 0) {
      await this.prisma.room.delete({
        where: { id: roomId },
      });
      return {
        message: `Room with id ${roomId} has been deleted because it has no members left`,
      };
    }

    const roomWithMembers = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        playerRooms: {
          include: {
            player: true,
          },
        },
      },
    });

    const formattedRoom = roomFormatter(roomWithMembers);

    return formattedRoom;
  }

  async deleteAllRoom() {
    await this.prisma.playerRoom.deleteMany({});

    await this.prisma.room.deleteMany({});

    return {
      message: 'All rooms and associated player rooms have been deleted',
    };
  }
}

const roomFormatter = (roomWithMembers: any) => {
  return {
    id: roomWithMembers.id,
    name: roomWithMembers.name,
    players: roomWithMembers.playerRooms.map((playerRoom) => ({
      id: playerRoom.player.id,
      name: playerRoom.player.name,
    })),
  };
};
