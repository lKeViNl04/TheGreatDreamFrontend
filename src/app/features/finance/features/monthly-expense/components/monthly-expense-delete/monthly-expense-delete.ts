import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';

@Component({
  selector: 'app-monthly-expense-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-expense-delete.html',
   
})
export class MonthlyExpenseDelete {
  // ===== Inputs & Outputs =====
  readonly monthlyExpense = input.required<MonthlyExpenseDTO>();
  readonly close = output<void>()
  readonly delete = output<number>();
  // ===== Estados internos =====
  readonly expenseId = computed(() => this.monthlyExpense()?.id ?? null);
  readonly expenseDate = computed(() => this.monthlyExpense()?.date ?? '');
  readonly expenseAmount = computed(() => this.monthlyExpense()?.amount ?? 0);

  // ===== Métodos públicos =====
  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    const id = this.expenseId();
    if (id != null) {
      this.delete.emit(id);
      this.close.emit();
    }
  }
}
