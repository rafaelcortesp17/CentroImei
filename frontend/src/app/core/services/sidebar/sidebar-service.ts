import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  isSidebarOpen = signal(false);

  toggle() {
    this.isSidebarOpen.update(value => !value);
  }
}
