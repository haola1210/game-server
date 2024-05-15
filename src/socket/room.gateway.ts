import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3001, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
}) // cổng mà gateway sẽ lắng nghe
export class RoomEventsGateway {
  @WebSocketServer()
  server: Server;

  rooms: IRoom[] = [];

  @SubscribeMessage('create-room')
  handleCreateRoom(@MessageBody() body: IRoom) {
    console.log('asd', body);
    this.rooms.push(body);
    this.server.emit('user-create-room-success', { rooms: this.rooms });
  }
}

interface IUser {
  name: string;
  id: string;
}

interface IRoom {
  name: string;
  id: string;
  users: IUser[];
}
