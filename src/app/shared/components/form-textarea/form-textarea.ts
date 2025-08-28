import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-textarea.html',
})
export class FormTextarea {
  readonly label = input<string>('');
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly textareaClass = input<string>('');
  readonly model = input<any>(null);
  readonly modelChange = output<any>();

  readonly showError = computed(() => this.required() 
    && (!this.model() || this.model().trim().length === 0));
}
