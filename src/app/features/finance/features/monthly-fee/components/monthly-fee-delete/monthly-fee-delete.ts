import { Component, computed, input } from '@angular/core';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';
import { BaseFormDelete } from '../../../../../../shared/abstract/base-form-delete';
import { ModalConfirm } from '../../../../../../shared/mod/modal-confirm/modal-confirm';

@Component({
  selector: 'app-monthly-fee-delete',
  standalone: true,
  imports: [ModalConfirm],
  templateUrl: './monthly-fee-delete.html'
})
export class MonthlyFeeDelete extends BaseFormDelete<MonthlyFeeDTO>{
  // ===== Inputs & Outputs (Signals) =====
  readonly entity = input.required<MonthlyFeeDTO>();
  // ===== Estados internos =====
  readonly feeCashBoxId = computed(() => this.entity()?.cashBoxId ?? '');
  readonly feeMemberId = computed(() => this.entity()?.member?.id ?? null);
}
