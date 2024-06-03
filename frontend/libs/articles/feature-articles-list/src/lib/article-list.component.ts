import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleListItemComponent } from './article-list-item/article-list-item.component';
import { EnteredToViewportDirective, PagerComponent } from '@infordevjournal/ui/components';
import {
  ArticlesListConfig,
  articlesListInitialState,
  ArticlesListStore,
  LoadStrategyType,
} from '@infordevjournal/articles/data-access';
import { InputComponent } from '@infordevjournal/core/forms/src/lib/fields/input/input.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const imports = [
  AsyncPipe,
  FormsModule,
  PagerComponent,
  InputComponent,
  ArticleListItemComponent,
  EnteredToViewportDirective,
];

@Component({
  selector: 'cdt-article-list',
  standalone: true,
  templateUrl: './article-list.component.html',
  imports,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnInit {
  private readonly articlesListStore = inject(ArticlesListStore);
  private readonly router = inject(Router);

  $totalPages = this.articlesListStore.totalPages;
  $articles = this.articlesListStore.articles.entities;
  $listConfig = this.articlesListStore.listConfig;
  $isLoading = this.articlesListStore.getArticlesLoading;

  protected search = '';
  protected pagerMode: 'pager' | 'onscroll' = 'onscroll';
  private readonly debounceTimeMs = 500;
  // TODO: unsubscribe with implimenting BaseComponent
  private searchSubject = new Subject<string>();

  constructor() {
    this.articlesListStore.listenToSocketLikeUnlike({});
  }

  ngOnInit(): void {
    this.listenToSearch();
  }

  onSearch() {
    this.searchSubject.next(this.search);
  }

  performSearch(searchValue: string) {
    const listConfig: ArticlesListConfig = {
      ...articlesListInitialState.listConfig,
      loadStrategy: 'INITIAL',
      filters: {
        ...this.articlesListStore.listConfig.filters(),
        tag: searchValue,
        offset: 0,
      },
    };

    this.articlesListStore.setListConfig(listConfig);
  }

  listenToSearch(): void {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  favorite(slug: string) {
    this.articlesListStore.favouriteArticle(slug);
  }

  unFavorite(slug: string) {
    this.articlesListStore.unFavouriteArticle(slug);
  }

  navigateToArticle(slug: string) {
    this.router.navigate(['/article', slug]);
  }

  setPage(page: number, loadStrategy: LoadStrategyType) {
    this.articlesListStore.setListPage(page, loadStrategy);
  }

  entredToViewport(intersected: boolean): void {
    if (intersected) {
      this.setPage(this.$listConfig.currentPage() + 1, 'LOAD_MORE');
    }
  }
}
