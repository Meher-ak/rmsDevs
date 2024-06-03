import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import {
  Articles,
  ArticlesListConfig,
  ArticlesListState,
  LoadStrategyType,
  articlesListInitialState,
} from './models/articles-list.model';
import { computed, inject } from '@angular/core';
import { ArticlesService } from './services/articles.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, tap } from 'rxjs';
import { setLoaded, setLoading, withCallState } from '@infordevjournal/core/data-access';
import { tapResponse } from '@ngrx/operators';
import { ActionsService } from './services/actions.service';
import { WSState } from '@infordevjournal/ws';
import { Article } from '@infordevjournal/core/api-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const ArticlesListStore = signalStore(
  { providedIn: 'root' },
  withState<ArticlesListState>(articlesListInitialState),
  withComputed(({ listConfig, articles }) => ({
    totalPages: computed(() =>
      Array.from(
        new Array(Math.ceil(articles()?.articlesCount / (listConfig()?.filters?.limit ?? 1))),
        (_, index) => index + 1,
      ),
    ),
  })),
  withMethods(
    (
      store,
      articlesService = inject(ArticlesService),
      actionsService = inject(ActionsService),
      wsState = inject(WSState),
    ) => ({
    loadArticles: rxMethod<ArticlesListConfig>(
      pipe(
        tap(() => setLoading('getArticles')),
        concatMap((listConfig) =>
          articlesService.query(listConfig).pipe(
            tapResponse({
              next: ({ articles, articlesCount }) => {
                articles =
                  listConfig.loadStrategy === 'LOAD_MORE' ? [...store.articles().entities, ...articles] : articles;

                patchState(store, {
                  articles: { articlesCount: articlesCount, entities: articles },
                  alreadyLoaded: true,
                  ...setLoaded('getArticles'),
                });
              },
              error: () => {
                patchState(store, { ...articlesListInitialState, alreadyLoaded: true, ...setLoaded('getArticles') });
              },
            }),
          ),
        ),
      ),
    ),
    listenToSocketArticles: rxMethod<unknown>(
      pipe(
        tap(() => setLoading('getArticle')),
        concatMap(() =>
          wsState.article.pipe(
            takeUntilDestroyed(),
            tapResponse({
              next: (article) => {
                const articles = [article, ...store.articles().entities];

                patchState(store, {
                  articles: {
                    entities: articles,
                    articlesCount: store.articles.articlesCount() + 1,
                  },
                  ...setLoaded('getArticle'),
                });
              },
              error: () => {
                patchState(store, { ...articlesListInitialState, ...setLoaded('getArticle') });
              },
            }),
          ),
        ),
      ),
    ),
    listenToSocketLikeUnlike: rxMethod<unknown>(
      pipe(
        tap(() => setLoading('getNewLikeUnlike')),
        concatMap(() =>
          wsState.likeUnlike.pipe(
            takeUntilDestroyed(),
            tapResponse({
              next: (likeUnlikeArticle) => {
                const articles = store
                  .articles()
                  .entities.map((article) => (article.slug === likeUnlikeArticle.slug ? likeUnlikeArticle : article));

                patchState(store, {
                  articles: {
                    entities: articles,
                    articlesCount: store.articles.articlesCount() + 1,
                  },
                  ...setLoaded('getNewLikeUnlike'),
                });
              },
              error: () => {
                patchState(store, { ...articlesListInitialState, ...setLoaded('getNewLikeUnlike') });
              },
            }),
          ),
        ),
      ),
    ),
    favouriteArticle: rxMethod<string>(
      pipe(
        concatMap((slug) =>
          actionsService.favorite(slug).pipe(
            tapResponse({
              next: ({ article }) => {
                patchState(store, {
                  articles: replaceArticle(store.articles(), article),
                });
              },
              error: () => {
                patchState(store, articlesListInitialState);
              },
            }),
          ),
        ),
      ),
    ),
    unFavouriteArticle: rxMethod<string>(
      pipe(
        concatMap((slug) =>
          actionsService.unfavorite(slug).pipe(
            tapResponse({
              next: ({ article }) => {
                patchState(store, {
                  articles: replaceArticle(store.articles(), article),
                });
              },
              error: () => {
                patchState(store, articlesListInitialState);
              },
            }),
          ),
        ),
      ),
    ),
    setListConfig: (listConfig: ArticlesListConfig) => {
      patchState(store, { listConfig });
    },
    setListPage: (page: number, loadStrategy: LoadStrategyType) => {
      const filters = {
        ...store.listConfig.filters(),
        offset: (store.listConfig().filters.limit ?? 10) * (page - 1),
      };
      const listConfig: ArticlesListConfig = {
        ...store.listConfig(),
        currentPage: page,
        loadStrategy,
        filters,
      };
      patchState(store, { listConfig });
    },
  })),
  withCallState({ collection: 'getArticles' }),
);

function replaceArticle(articles: Articles, payload: Article): Articles {
  const articleIndex = articles.entities.findIndex((a) => a.slug === payload.slug);
  const entities = [
    ...articles.entities.slice(0, articleIndex),
    Object.assign({}, articles.entities[articleIndex], payload),
    ...articles.entities.slice(articleIndex + 1),
  ];
  return { ...articles, entities };
}
