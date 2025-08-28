import { Component, input, effect, computed } from '@angular/core';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';

import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { FormTextarea } from '../../../../../../shared/components/form-textarea/form-textarea';
import { BaseFormAdd } from '../../../../../../shared/abstract/base-form-add';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';


@Component({
  selector: 'app-monthly-expense-add',
  standalone: true,
  imports: [FormInput, FormTextarea, FormSelect, ModalShell],
  templateUrl: './monthly-expense-add.html',
})
export class MonthlyExpenseAdd extends BaseFormAdd<MonthlyExpenseDTO>{
  // ===== Outputs & Input =====
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  // ===== Constructor =====
  constructor () {
    super();
    this.entity.set({
      description: '',
      amount: 0,
      date: ''
    });
    
    effect(() => {
      const cb = this.cashboxOptions()?.[0]?.value;
      this.entity.update(m => ({ ...m, cashBoxId: cb ?? undefined }));
    }
    );
  }
  // ===== Computed properties =====
  readonly isCashBoxIdValid = computed(() => {
    const m = this.entity();
    return !!m.cashBoxId && Number(m.cashBoxId) > 0;
  });

  readonly isDescriptionValid = computed(() => {
    const v = this.entity().description;
    return v != null && v.trim().length > 0;
  });

  readonly isAmountValid = computed(() => {
    const v = this.entity().amount;
    return v != null && Number(v) > 0;
  });

  readonly isDateValid = computed(() => {
    const v = this.entity().date;
    return v != null && v.trim().length === 10; // Formato YYYY-MM-DD
  });
  // ===== Override =====
  override formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isDescriptionValid() &&
    this.isAmountValid() &&
    this.isDateValid()
  );

  override buildPayload(e: Partial<MonthlyExpenseDTO>): MonthlyExpenseDTO {
    return {
      ...(e as MonthlyExpenseDTO),
      cashBoxId: Number(e.cashBoxId),
      amount: Number(e.amount),
      date: e.date ?? '',
      description: e.description ?? '',
    };
  }

  override invalidFields(): string[] {
    return [
      !this.isCashBoxIdValid() && '"CashBoxId"',
      !this.isDescriptionValid() && '"Description"',
      !this.isAmountValid() && '"Amount"',
      !this.isDateValid() && '"Date"',
    ].filter(Boolean) as string[];
  }

}
