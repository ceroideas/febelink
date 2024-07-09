import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService, IHttpService } from './http.service';

export class ChatMessage {
  messageId: string = "";
  userId: string = "";
  userName: string = "";
  userAvatar: string = "";
  toUserId: string = "";
  time: number | string = 0;
  message: string = "";
  status: string = "";
}

export class Pages {
  name: string = "";
  icon: string = "";
  url: string = "";
  urlweb: string = "";
  description: string = "";
}

export class UserInfo {
  id: string = "";
  name?: string = "";
  avatar?: string = "";
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public events: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private httpSVC: HttpService) {}

  mockNewMsg(msg: any) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success',
    };

    setTimeout(() => {
      this.events.emit(mockMsg);
    }, Math.random() * 1800);
  }

  chatReceived() {
    return this.events;
  }

  getMsgList(): Observable<ChatMessage[]> {
    const msgListUrl = './assets/mock/msg-list.json';
    return this.http
      .get<any>(msgListUrl)
      .pipe(map((response) => response.array));
  }

  getPages(): Observable<Pages[]> {
    const pages = './assets/mock/pages.json';
    return this.http.get<any>(pages).pipe(map((response) => response.array));
  }

  sendMsg(msg: ChatMessage) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(msg), Math.random() * 1000)
    ).then(() => this.mockNewMsg(msg));
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: '140000198202211138',
      name: 'Luff',
      avatar: './assets/user.jpg',
    };
    return new Promise((resolve) => resolve(userInfo));
  }

  getMyChatRooms() {
    return this.httpSVC.get('chat/list');
  }

  createChat(receiverId: number): Promise<IHttpService> {
    return this.httpSVC.post('chat/create', { receiverId });
  }
}
