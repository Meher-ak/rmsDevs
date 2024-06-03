import { inject, Injectable } from '@angular/core';
import { ArticlesListConfig, ArticlesListStore } from '@infordevjournal/articles/data-access/src';

@Injectable({ providedIn: 'root' })
export class ProfileLibService {
  private readonly articlesListStore = inject(ArticlesListStore);

  resolveArticles(config: ArticlesListConfig): void {
    const $isLoaded = this.articlesListStore.getArticlesLoaded;
    this.articlesListStore.setListConfig(config);
    this.articlesListStore.loadArticles($isLoaded() ? config : this.articlesListStore.listConfig);
  }
}
