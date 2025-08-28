import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';

@Component({
  selector: 'app-monthly-fee-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-fee-delete.html',
   
})
export class MonthlyFeeDelete {
  // ===== Inputs & Outputs (Signals) =====
  readonly monthlyFee = input.required<MonthlyFeeDTO>();
  readonly close = output<void>();
  readonly delete = output<number>();

  // ===== Estados internos =====
  readonly feeId = computed(() => this.monthlyFee()?.id ?? null);
  readonly feeCashBoxId = computed(() => this.monthlyFee()?.cashBoxId ?? '');
  readonly feeMemberId = computed(() => this.monthlyFee()?.member?.id ?? null);

  // ===== Métodos públicos =====
  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    const id = this.feeId();
    if (id != null) {
      this.delete.emit(id);
      this.close.emit();
    }
  }
}
