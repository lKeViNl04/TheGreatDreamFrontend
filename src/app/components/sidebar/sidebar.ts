import {  ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Item {
  name: string;
  svg: string;
  link: string;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  sidebarOpen = signal(false);

  items: Item[] = [
    { name: 'Home', svg: '/icons/sprite.svg#Home', link: '/dashboard' },
    { name: 'Member', svg: '/icons/sprite.svg#SearchUser', link: '/member' },
    { name: 'Finance', svg: '/icons/sprite.svg#Dollar', link: '/finance' },
    { name: 'Project', svg: '/icons/sprite.svg#ProjectWork', link: '/project' },
  ];

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }
}
