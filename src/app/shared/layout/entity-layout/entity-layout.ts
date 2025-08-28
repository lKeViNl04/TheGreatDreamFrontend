import { Component, input, output } from '@angular/core';
import { SearchInput } from "../../components/search-input/search-input";
import { AddButton } from "../../components/add-button/add-button";
import { PaginationComponent } from "../../components/pagination/pagination";

@Component({
  selector: 'app-entity-layout',
  imports: [SearchInput, AddButton, PaginationComponent],
  templateUrl: './entity-layout.html'
})
export class EntityLayout {
  title = input<string>('');
  subtitle = input<string>('');

  addButtonLabel = input<string>('Add');
  addButtonIcon = input<string>('Add');

  currentPage = input<number>(1);
  totalPages = input<number>(1);
  
  searchPlaceholder = input<string>('Search...');
  searchTerm = input<string>('');         
  searchTermChange = output<string>();    

  onAdd = output<void>();
  onPageChange = output<number>();
}
