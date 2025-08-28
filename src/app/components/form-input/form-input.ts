import { Component, input, output, ChangeDetectionStrategy, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.html',
   
})
export class FormInput {
  readonly label = input<string>('');
  readonly name = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly model = input<any>(null);
  readonly inputClass = input<string>('');
  
  readonly modelChange = output<any>();

  readonly showError = computed(() => this.required() 
    && (this.model() == null || String(this.model()).trim().length === 0));

}
