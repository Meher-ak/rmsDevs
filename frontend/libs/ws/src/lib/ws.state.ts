import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Article } from '@infordevjournal/core/api-types';

@Injectable({ providedIn: 'root' })
export class WSState {
  private articleSubject: Subject<Article> = new Subject();
  public article: Observable<Article> = this.articleSubject.asObservable();

  private tagSubject: Subject<string> = new Subject();
  public tag: Observable<string> = this.tagSubject.asObservable();

  private likeUnlikeSubject: Subject<Article> = new Subject();
  public likeUnlike: Observable<Article> = this.likeUnlikeSubject.asObservable();

  setArticle(article: Article): void{
    this.articleSubject.next(article);
  }

  setTag(tag: string): void{
    this.tagSubject.next(tag);
  }

  setLikeUnlike(likeUnlike: Article): void{
    this.likeUnlikeSubject.next(likeUnlike);
  }
}
