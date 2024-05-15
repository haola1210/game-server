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
  constructor(private matchsService: MatchsService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected');
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnected');
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
}
