import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [],
  templateUrl: './add-button.html',
   
})
export class AddButton {
  readonly label = input<string>('Add');
  readonly icon = input<string>('AddMember');
  readonly clicked = output<void>();
}
