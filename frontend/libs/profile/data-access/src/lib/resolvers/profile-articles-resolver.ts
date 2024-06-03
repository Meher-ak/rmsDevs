import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ArticlesListConfig, articlesListInitialState } from '@infordevjournal/articles/data-access';
import { of } from 'rxjs';
import { ProfileLibService } from '../services/profile-lib.service';

export const profileArticlesResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const username = route.params['username'];
  const profileLibService = inject(ProfileLibService);

  const config: ArticlesListConfig = {
    ...articlesListInitialState.listConfig,
    loadStrategy: 'INITIAL',
    filters: {
      ...articlesListInitialState.listConfig.filters,
      author: username,
    },
  };

  profileLibService.resolveArticles(config);

  return of(true);
};
