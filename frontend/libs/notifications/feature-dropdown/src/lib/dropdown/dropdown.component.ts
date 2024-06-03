import { Component, inject } from '@angular/core';

import { NotificationsStore } from '@infordevjournal/notifications/data-access';

@Component({
  selector: 'cdt-dropdown',
  standalone: true,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  private readonly notificationsStore = inject(NotificationsStore);

  $tags = this.notificationsStore.tags;
  $articles = this.notificationsStore.articles;
  $likeUnlikes = this.notificationsStore.likeUnlikes;
}
