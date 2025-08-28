import { Component, computed, input } from '@angular/core';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';
import { BaseFormDelete } from '../../../../../../shared/abstract/base-form-delete';
import { ModalConfirm } from '../../../../../../shared/mod/modal-confirm/modal-confirm';

@Component({
  selector: 'app-monthly-expense-delete',
  standalone: true,
  imports: [ModalConfirm],
  templateUrl: './monthly-expense-delete.html'
})
export class MonthlyExpenseDelete extends BaseFormDelete<MonthlyExpenseDTO> {
  // ===== Inputs & Outputs =====
  readonly entity = input.required<MonthlyExpenseDTO>();
  // ===== Estados internos =====
  readonly expenseDate = computed(() => this.entity()?.date ?? '');
  readonly expenseAmount = computed(() => this.entity()?.amount ?? 0);
}
