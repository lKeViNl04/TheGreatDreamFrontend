import {Component, input, output, signal} from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.html',
})
export class SearchInput {
  readonly searchTerm = input<string>('');
  readonly placeholder = input<string>('Search...');
  readonly debounce = input<number>(0);

  readonly searchTermChange = output<string>();

  private debounceId: any = null;

  readonly value = signal<string>('');

  constructor() {
    this.value.set(this.searchTerm());
  }

  onInput(value: string): void {
    this.value.set(value);

    if (this.debounce() > 0) {
      if (this.debounceId) {
        clearTimeout(this.debounceId);
      }
      this.debounceId = setTimeout(() => {
        this.emitChange();
      }, this.debounce());
    } else {
      this.emitChange();
    }
  }

  clear(): void {
    if (this.value() !== '') {
      this.value.set('');
      this.emitChange();
    }
  }

  private emitChange(): void {this.searchTermChange.emit(this.value());}
}