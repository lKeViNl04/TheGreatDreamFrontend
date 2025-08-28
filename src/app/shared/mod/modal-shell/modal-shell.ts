import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-shell.html'
})
export class ModalShell {
  readonly close = output<void>();
  readonly save = output<void>();

  onCancel(): void { this.close.emit();}
  onSubmit(): void { this.save.emit();}
}
