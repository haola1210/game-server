import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsServices } from './rooms.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsServices],
  exports: [RoomsServices],
})
export class RoomsModule {}
