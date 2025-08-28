import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-dropdown.html'
})
export class HeaderDropdown {
  
  readonly dropdownOpen = signal(false);
  readonly currentViewName = signal('');


  views = [
    { route: 'cashbox', label: 'Cashbox' },
    { route: 'monthly-expense', label: 'Monthly Expense' },
    { route: 'monthly-fee', label: 'Monthly Fee' }
  ];
  // Inyección 
  private router = inject(Router);

  constructor() {
    //  cada vez que cambia la ruta, actualizamos currentViewName
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const current = this.views.find(v => this.router.url.includes(v.route));
        this.currentViewName.set(current ? current.label : '');
      });
  }

  //  devuelve todas las vistas menos la actual
  readonly otherViews = computed(() => this.views.filter(v => v.label !== this.currentViewName()));
}