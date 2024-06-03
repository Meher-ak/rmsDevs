import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { ArticlesListConfig, articlesListInitialState } from '@infordevjournal/articles/data-access';
import { ProfileLibService } from '../services/profile-lib.service';

export const profileFavoritesResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const username = route?.parent?.params['username'];
  const profileLibService = inject(ProfileLibService);

  const config: ArticlesListConfig = {
    ...articlesListInitialState.listConfig,
    loadStrategy: 'INITIAL',
    filters: {
      ...articlesListInitialState.listConfig.filters,
      favorited: username,
    },
  };

  profileLibService.resolveArticles(config);

  return of(true);
};
