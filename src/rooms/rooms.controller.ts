import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomsServices } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsServices: RoomsServices) {}

  @Post()
  async createRoom(
    @Body()
    {
      playerId,
      roomData,
    }: {
      playerId: string;
      roomData: {
        name: string;
      };
    },
  ) {
    return await this.roomsServices.createRoom(playerId, roomData);
  }

  @Get('all')
  async getAllRoom() {
    return await this.roomsServices.getAllRoom();
  }
}
