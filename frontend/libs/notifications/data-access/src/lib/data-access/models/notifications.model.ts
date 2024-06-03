import { Article } from '@infordevjournal/core/api-types/src';

export interface NotificationsState {
  tags: string[];
  articles: Article[];
  likeUnlikes: Article[];
  isNewNotificationsSeenByUser: boolean;
}

export const notificationsInitialState: NotificationsState = {
  tags: [],
  articles: [],
  likeUnlikes: [],
  isNewNotificationsSeenByUser: true,
};
