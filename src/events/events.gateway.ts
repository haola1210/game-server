import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MatchsService } from 'src/matchs/matchs.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  rooms: IRoom[] = [];

  constructor(private matchsService: MatchsService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      'connected',
      client.id,
      Array.from(this.server.sockets.sockets.keys()),
    );
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(
      'disconnected',
      client.id,
      Array.from(this.server.sockets.sockets.keys()),
    );
  }

  @SubscribeMessage('create-match')
  async createMatch(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: any,
  ) {
    console.log(data);
  }

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
