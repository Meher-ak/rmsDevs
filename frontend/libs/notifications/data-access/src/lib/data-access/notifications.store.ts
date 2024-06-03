import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe } from 'rxjs';
import { notificationsInitialState, NotificationsState } from './models/notifications.model';
import { WSState } from '@infordevjournal/ws/src';
import { tapResponse } from '@ngrx/component-store';

export const NotificationsStore = signalStore(
  { providedIn: 'root' },
  withState<NotificationsState>(notificationsInitialState),
  withMethods((store, wsState = inject(WSState)) => ({
    listenToArticle: rxMethod<void>(
      pipe(
        concatMap(() =>
          wsState.article.pipe(
            tapResponse({
              next: (article) => {
                const articles = [article, ...store.articles()];

                patchState(store, {
                  articles,
                  isNewNotificationsSeenByUser: false,
                });
              },
              error: () => {
                patchState(store, { ...notificationsInitialState });
              },
            }),
          ),
        ),
      ),
    ),
    listenToTag: rxMethod<void>(
      pipe(
        concatMap(() =>
          wsState.tag.pipe(
            tapResponse({
              next: (tag) => {
                patchState(store, {
                  tags: [tag, ...store.tags()],
                  isNewNotificationsSeenByUser: false,
                });
              },
              error: () => {
                patchState(store, { ...notificationsInitialState });
              },
            }),
          ),
        ),
      ),
    ),
    listenToLikeUnlike: rxMethod<void>(
      pipe(
        concatMap(() =>
          wsState.likeUnlike.pipe(
            tapResponse({
              next: (article) => {
                const likeUnlikes = [article, ...store.likeUnlikes()];

                patchState(store, {
                  likeUnlikes,
                  isNewNotificationsSeenByUser: false,
                });
              },
              error: () => {
                patchState(store, { ...notificationsInitialState });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
