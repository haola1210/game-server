import { RoomsServices } from './../rooms/rooms.service';
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

  constructor(
    private matchsService: MatchsService,
    private roomsServices: RoomsServices,
  ) {}

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

  //user create room
  @SubscribeMessage('user-create-room')
  async userCreateRoom(
    @MessageBody()
    { playerId, roomData }: { playerId: string; roomData: { name } },
    @ConnectedSocket() client: Socket,
  ) {
    const newRoom = await this.roomsServices.createRoom(playerId, roomData);

    const rooms = await this.roomsServices.getAllRoom();

    if (newRoom) {
      client.join(newRoom.id + '');
      this.server.emit('user-create-room-success', {
        rooms: rooms,
        playerId: playerId,
        room: newRoom,
      });
    }
  }

  // join room
  @SubscribeMessage('user-join-room')
  async userJoinRoom(
    @MessageBody() { playerId, roomId }: { playerId: string; roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.roomsServices.joinRoom(playerId, roomId);

    const rooms = await this.roomsServices.getAllRoom();

    if (room) {
      client.join(roomId + '');
      this.server.emit('user-join-room-success', {
        rooms,
        playerId,
        room,
      });
      this.server.to(roomId + '').emit('someone-join-room-success', { room });
    }
  }

  // join room
  @SubscribeMessage('user-start-game')
  async userStartGame(@MessageBody() { roomId }: { roomId: number }) {
    this.server.to(roomId + '').emit('user-start-game-success');
  }
}
