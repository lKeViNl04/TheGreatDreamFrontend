import { Component,  input, output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html',
})

export class PaginationComponent {
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly pageChanged = output<number>();

  previousPage() {
    if (this.currentPage() > 1) {
      this.pageChanged.emit(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChanged.emit(this.currentPage() + 1);
    }
  }
}
