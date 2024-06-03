import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { pipe } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
import { HomeService } from './home.service';
import { WSState } from '@infordevjournal/ws/src';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface HomeState {
  tags: string[];
}

@Injectable()
export class HomeStoreService extends ComponentStore<HomeState> implements OnStateInit {
  constructor(private readonly homeService: HomeService, private readonly wsState: WSState) {
    super({ tags: [] });
  }

  ngrxOnStateInit() {
    this.getTags();
    this.listenToSocketTag();
  }

  // SELECTORS
  tags$ = this.select((store) => store.tags);

  // EFFECTS
  readonly getTags = this.effect<void>(
    pipe(
      switchMap(() =>
        this.homeService.getTags().pipe(
          tapResponse(
            (response) => {
              this.patchState({ tags: response.tags });
            },
            (error) => {
              console.error('error getting tags: ', error);
            },
          ),
        ),
      ),
    ),
  );

  readonly listenToSocketTag = this.effect<void>(
    pipe(
      concatMap(() =>
        this.wsState.tag.pipe(
          takeUntilDestroyed(),
          tapResponse(
            (tag) => {
              console.log('taaaag',tag)
              this.patchState({ tags: [tag, ...this.get().tags] });
            },
            (error) => {
              console.error('error getting tags: ', error);
            },
          ),
        ),
      ),
    ),
  );
}
