import { inject, Injectable } from '@angular/core';
import { ArticlesListConfig, ArticlesListStore } from '@infordevjournal/articles/data-access/src';

@Injectable({ providedIn: 'root' })
export class ProfileLibService {
  private readonly articlesListStore = inject(ArticlesListStore);

  resolveArticles(config: ArticlesListConfig): void {
    // we use this assignemet due to the behavior of rxMethod reactive method from ngrx
    const isAlreadyLoadedArticles =
      this.articlesListStore.alreadyLoaded && this.articlesListStore.alreadyLoaded();
    this.articlesListStore.setListConfig(config);
    this.articlesListStore.loadArticles(isAlreadyLoadedArticles ? config : this.articlesListStore.listConfig);
  }
}
