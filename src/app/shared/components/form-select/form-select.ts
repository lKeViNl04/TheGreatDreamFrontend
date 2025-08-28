import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Strongly-typed option for the select component
export type SelectOption<T = unknown> = { label: string; value: T };

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-select.html',
   
})
export class FormSelect<T = unknown> {
  readonly label = input<string>('');
  readonly name = input<string>('');
  readonly options = input<ReadonlyArray<SelectOption<T>>>([]);
  readonly model = input<T | null>(null);
  readonly selectClass = input<string>('');
  readonly required = input<boolean>(false);

  readonly modelChange = output<T >();

  readonly showError = computed(() => { if (!this.required()) return false; 
    const value = this.model() as unknown; if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0; return false; });
}
