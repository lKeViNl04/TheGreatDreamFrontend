import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderDropdown } from './components/header-dropdown/header-dropdown';

@Component({
  selector: 'app-finance-layaout',
  standalone: true,
  imports: [CommonModule, HeaderDropdown, RouterModule],
  templateUrl: './finance.html'
})
export class Finance {

}
