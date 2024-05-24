import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Get('/:id')
  async getRoomById(@Param() { id }: { id: string }) {
    return await this.roomsServices.getRoomById(Number(id));
  }

  @Post('join')
  async joinRoom(
    @Body() { playerId, roomId }: { playerId: string; roomId: number },
  ) {
    return await this.roomsServices.joinRoom(playerId, roomId);
  }

  @Post('leave')
  async leaveRoom(
    @Body() { playerId, roomId }: { playerId: string; roomId: number },
  ) {
    return await this.roomsServices.leaveRoom(playerId, roomId);
  }

  @Delete('all')
  async deleteAllRoom() {
    return await this.roomsServices.deleteAllRoom();
  }
}
