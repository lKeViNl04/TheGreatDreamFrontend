import { Component, input, computed } from '@angular/core';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';

import { FormTextarea } from '../../../../../../shared/components/form-textarea/form-textarea';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { BaseFormEdit } from '../../../../../../shared/abstract/base-form-edit';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-monthly-expense-edit',
  standalone: true,
  imports: [FormInput, FormSelect, FormTextarea, ModalShell],
  templateUrl: './monthly-expense-edit.html',
})
export class MonthlyExpenseEdit extends BaseFormEdit<MonthlyExpenseDTO>{
  // ===== Inputs & Outputs =====
  readonly cashboxOptions = input<{ value: any, label: string }[]>([]);
  // ======= Constructor =======
  constructor() {super()}
  // ===== Computed =====
  readonly isCashBoxIdValid = computed(() => {
    const me = this.editEntity();
    return !!me?.cashBoxId && Number(me.cashBoxId) > 0;
  });

  readonly isDescriptionValid = computed(() => {
    const v = this.editEntity();
    return v != null && v.description.trim().length > 0;
  })

  readonly isAmountValid = computed(() => {
    const v = this.editEntity();
    return v != null && Number(v.amount) > 0;
  });

  readonly isDateValid = computed(() => {
    const v = this.editEntity() ;
    return v != null && v.date.trim().length === 10;
  });
  //===== Override =====
  override formValid = computed(() => 
    this.isCashBoxIdValid() && 
    this.isDescriptionValid() && 
    this.isAmountValid() && 
    this.isDateValid()
  );

  protected override isSame(): boolean {
    const originalExpense = this.entity();
    const editExpense = this.editEntity();
    return (
      originalExpense!.cashBoxId === editExpense!.cashBoxId &&
      originalExpense!.description === editExpense!.description &&
      originalExpense!.amount === editExpense!.amount &&
      originalExpense!.date === editExpense!.date
    );
  }

  override invalidFields(): string[] {
    return [
      !this.isCashBoxIdValid() && "Cashbox",
      !this.isDescriptionValid() && "Description",
      !this.isAmountValid() && "Amount",
      !this.isDateValid() && "Date"
    ].filter(Boolean) as string[];
  }
}
