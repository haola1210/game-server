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

  /** in room list */

  //user create room
  @SubscribeMessage('user-get-room')
  userGetRoom(@ConnectedSocket() client: Socket) {
    client.emit('user-get-room-success', { rooms: this.rooms });
  }

  //user create room
  @SubscribeMessage('user-create-room')
  userCreateRoom(
    @MessageBody() room: IRoom,
    @ConnectedSocket() client: Socket,
  ) {
    this.rooms.push(room);
    client.join(room.id);
    this.server.emit('user-create-room-success', {
      rooms: this.rooms,
      user: room.users[0],
      room,
    });
  }

  // join room
  @SubscribeMessage('user-join-room')
  userJoinRoom(
    @MessageBody() { user, room }: { user: IUser; room: IRoom },
    @ConnectedSocket() client: Socket,
  ) {
    this.rooms = this.rooms.map((roomItem) =>
      roomItem.id === room.id
        ? {
            ...roomItem,
            users: [...roomItem.users, user],
          }
        : roomItem,
    );
    client.join(room.id);
    const newRoom = this.rooms.find((roomItem) => roomItem.id === room.id);

    this.server.emit('user-join-room-success', {
      rooms: this.rooms,
      user,
      room: newRoom,
    });

    this.server.to(room.id).emit('someone-join-room-success', {
      room: newRoom,
    });
  }

  /** in room */
  @SubscribeMessage('user-get-room-detail')
  userGetRoomDetail(
    @MessageBody() body: { room_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('user-get-room-detail-success', {
      room: this.rooms.find((item) => item.id === body.room_id),
    });
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
