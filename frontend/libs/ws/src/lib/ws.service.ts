import { inject, Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';

import { io, Socket } from 'socket.io-client';

import { WSState } from './ws.state';
import { EventEnum } from './ws.model';
import { Article } from '@infordevjournal/core/api-types/src';
import { ApiService } from '@infordevjournal/core/http-client/src';
import { ArticlesService } from '@infordevjournal/articles/data-access';

@Injectable({ providedIn: 'root' })
export class WSService {
  private readonly wsState = inject(WSState);
  private readonly apiService = inject(ApiService);
  private readonly articleService = inject(ArticlesService);

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
      const article = Array.isArray(event) ? event[0] : event;
      this.saveArticle(article);
      this.wsState.setArticle(article);
    });
  }

  public listenToTags(): void {
    this.socket?.on(EventEnum.TAGS, (event: string) => {
      this.saveTag(event);
      this.wsState.setTag(event);
    });
  }

  public listenToLikeUnlike(): void {
    this.socket?.on(EventEnum.LIKE_UNLIKE, (event: Article) => {
      this.wsState.setLikeUnlike(event);
    });
  }

  private saveArticle(article: Article): void {
    article.slug = '';
    lastValueFrom(this.articleService.publishArticle(article).pipe(tap(() => console.log('article saved'))));
  }

  private saveTag(tag: string): void {
    lastValueFrom(this.apiService.post('/tags', { tag }).pipe(tap(() => console.log('tag saved'))));
  }
}
