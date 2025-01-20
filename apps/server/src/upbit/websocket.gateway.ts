import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketService } from './websocket.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  private server: Server;

  private currentClients = new Map<string, string>();

  constructor(private readonly websocketService: WebsocketService) {}

  onModuleInit() {
    this.websocketService.getTickerStream().subscribe((ticker) => {
      this.server.emit('ticker', ticker);
    });

    this.websocketService.getOrderbookStream().subscribe((orderbook) => {
      this.broadcastMessage('orderbook', orderbook);
    });

    this.websocketService.getTradeStream().subscribe((trade) => {
      this.broadcastMessage('trade', trade);
    });
  }

  handleConnection(client: Socket) {
    console.log(`${client.id} connected`);
  }
  handleDisconnect(client: Socket) {
    console.log(`${client.id} disconnected`);
    this.currentClients.delete(client.id);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, marketCode: string) {
    console.log(`${client.id} : ${marketCode} 구독`);
    this.currentClients.set(client.id, marketCode);
  }

  private broadcastMessage(type: string, data: any) {
    this.currentClients.forEach((code, clientId) => {
      if (data.code === code) {
        const client = this.server.sockets.sockets.get(clientId);

        if (client) {
          client.emit(type, data);
        }
      }
    });
  }
}
