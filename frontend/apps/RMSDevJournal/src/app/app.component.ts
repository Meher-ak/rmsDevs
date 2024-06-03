import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore, LocalStorageJwtService } from '@infordevjournal/auth/data-access';
import { WSService } from '@infordevjournal/ws';
import { filter, take } from 'rxjs/operators';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NotificationsStore } from '@infordevjournal/notifications/data-access/src';

@Component({
  selector: 'cdt-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FooterComponent, NavbarComponent, RouterModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly localStorageJwtService = inject(LocalStorageJwtService);
  private readonly authStore = inject(AuthStore);
  private readonly wsService = inject(WSService);
  private readonly notificationsStore = inject(NotificationsStore);

  $user = this.authStore.user;
  $isLoggedIn = this.authStore.loggedIn;

  ngOnInit() {
    this.localStorageJwtService
      .getItem()
      .pipe(
        take(1),
        filter((token) => !!token),
      )
      .subscribe(() => this.authStore.getUser());

    this.connectToSocket();
  }

  getNotificationsOnLogin = effect(() => {
    if (this.$isLoggedIn()) {
      this.notificationsStore.listenToTag();
      this.notificationsStore.listenToArticle();
      this.notificationsStore.listenToLikeUnlike();
    }
  });

  private connectToSocket(): void {
    this.wsService.connect();
    this.wsService.onConnection();
  }
}
