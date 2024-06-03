import { Article } from '@infordevjournal/core/api-types';

export enum EventEnum {
  TAGS = 'tags',
  ARTICLES = 'articles',
  LIKE_UNLIKE = 'like-unlike',
}

export interface SocketState {
  article: Article;
  tag: string;
  likeUnlike: Article;
}

export const socketInitialState: SocketState = {
  article: {
    slug: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    createdAt: '',
    updatedAt: '',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      bio: '',
      image: '',
      following: false,
      loading: false,
    },
  },
  tag: '',
  likeUnlike: {
    slug: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    createdAt: '',
    updatedAt: '',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      bio: '',
      image: '',
      following: false,
      loading: false,
    },
  },
};
