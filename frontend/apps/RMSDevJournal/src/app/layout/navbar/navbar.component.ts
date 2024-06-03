import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@infordevjournal/core/api-types';
import { DropdownComponent } from '@infordevjournal/notifications/feature-dropdown';
import { ClickOutsideDirective } from '@infordevjournal/ui/directives/src';

@Component({
  selector: 'cdt-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [RouterLink ,DropdownComponent, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  user = input.required<User>();
  isLoggedIn = input.required<boolean>();

  isNotificationsOpen = false;

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }
}
