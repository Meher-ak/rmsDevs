import { inject, Injectable } from '@angular/core';

import { io, Socket } from 'socket.io-client';

import { EventEnum } from './ws.model';
import { Article } from '@infordevjournal/core/api-types/src';
import { WSState } from './ws.state';

@Injectable({ providedIn: 'root' })
export class WSService {
  private readonly wsState = inject(WSState);
  // TODO: this property is temporary fix for disconnecting socket
  private autoReconnect = true;
  private socket: Socket | null = null;
  private readonly SERVER_URL = 'http://localhost:5001';

  public connect(): void {
    this.autoReconnect = true;
    if (!this.socket) {
      this.socket = io(this.SERVER_URL);
    }
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.autoReconnect = false;
  }

  private listen(): void {
    this.listenToTags();
    this.listenToArticles();
    this.listenToLikeUnlike();
    this.listenToDisconnect();
  }

  public listenToDisconnect(): void {
    this.socket?.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server ==>', reason);
      this.socket?.removeAllListeners();
      if (this.autoReconnect) {
        this.connect();
        this.onConnection();
      }
    });
  }

  public onConnection(): void {
    this.socket?.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.listen();
    });
  }

  public listenToArticles(): void {
    this.socket?.on(EventEnum.ARTICLES, (event: Article | Article[]) => {
      this.wsState.setArticle(Array.isArray(event) ? event[0] : event);
    });
  }

  public listenToTags(): void {
    this.socket?.on(EventEnum.TAGS, (event: string) => {
      this.wsState.setTag(event);
    });
  }

  public listenToLikeUnlike(): void {
    this.socket?.on(EventEnum.LIKE_UNLIKE, (event: Article) => {
      this.wsState.setLikeUnlike(event);
    });
  }

  // private saveArticle(article: Article): void {
  //   article.slug = '';
  //   lastValueFrom(this.articleService.publishArticle(article).pipe(tap(() => console.log('article saved'))));
  // }
}
