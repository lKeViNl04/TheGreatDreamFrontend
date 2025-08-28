import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashboxDTO } from '../../models/cashbox-dto';

@Component({
  selector: 'app-cashbox-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashbox-delete.html',
   
})
export class CashboxDelete {
  // ===== Inputs & Outputs =====
  readonly cashbox = input.required<CashboxDTO>();
  readonly close = output<void>();
  readonly delete = output<number>();
  // ===== Estados internos =====
  readonly cashBoxId = computed(() => this.cashbox()?.id ?? null);
  readonly cashBoxYear = computed(() => this.cashbox()?.year ?? '')
  readonly cashBoxMonth = computed(() => this.cashbox()?.month ?? '');
  // ===== Métodos públicos =====
  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    const id = this.cashBoxId();
    if (id != null) {
      this.delete.emit(id);
      this.close.emit();
    }
  }


}
