import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environments';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket!: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  connect(userId: string) {
    this.socket = io(environment.backendURL_socket, {
      transports: ['websocket'],
    });

    this.socket.emit('join', userId);

    this.socket.on('commentNotification', (notification) => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });

    this.socket.on('replyNotification', (notification) => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}
