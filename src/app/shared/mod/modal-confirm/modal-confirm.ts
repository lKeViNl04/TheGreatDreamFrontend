import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  templateUrl: './modal-confirm.html'
})
export class ModalConfirm {
  readonly close = output<void>();
  readonly confirm = output<void>();

  onCancel(): void { this.close.emit();}
  onConfirm(): void { this.confirm.emit();}
}
