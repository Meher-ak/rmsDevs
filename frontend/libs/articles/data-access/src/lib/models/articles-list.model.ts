import { Article } from '@infordevjournal/core/api-types';

export interface ArticlesListState {
  listConfig: ArticlesListConfig;
  articles: Articles;
  alreadyLoaded: boolean,
}

export interface ArticlesListConfig {
  type: ListType;
  currentPage: number;
  filters: Filters;
  loadStrategy: LoadStrategyType;
}

export interface Filters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
  title?: string;
}

export type ListType = 'ALL' | 'FEED';

export type LoadStrategyType = 'INITIAL' | 'LOAD_MORE';

export interface Articles {
  entities: Article[];
  articlesCount: number;
}

export const articlesListInitialState: ArticlesListState = {
  listConfig: {
    type: 'ALL',
    currentPage: 1,
    loadStrategy: 'INITIAL',
    filters: {
      limit: 10,
    },
  },
  articles: {
    entities: [],
    articlesCount: 0,
  },
  alreadyLoaded: false,
};
