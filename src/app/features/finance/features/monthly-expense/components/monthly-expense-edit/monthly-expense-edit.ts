import { Component, inject, ChangeDetectionStrategy, signal, input, output, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';

import { FormTextarea } from '../../../../../../components/form-textarea/form-textarea';
import { FormInput } from '../../../../../../components/form-input/form-input';
import { FormSelect } from '../../../../../../components/form-select/form-select';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';

@Component({
  selector: 'app-monthly-expense-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormSelect, FormTextarea],
  templateUrl: './monthly-expense-edit.html',
   
})
export class MonthlyExpenseEdit {
  // ===== Inyección de servicios =====
  private notification = inject(NotificationService);
  // ===== Inputs & Outputs =====
  readonly editExpense = signal<MonthlyExpenseDTO | null>(null);
  readonly monthlyExpense = input<MonthlyExpenseDTO | null>(null);
  readonly cashboxOptions = input<{ value: any, label: string }[]>([]);
  readonly close = output<void>();
  readonly edit = output<MonthlyExpenseDTO>();

  // ======= Constructor =======
  constructor() {
    effect(() => {
      const expense = this.monthlyExpense();
      this.editExpense.set(expense ? structuredClone(expense) : null);
    });
  }

  // ===== Computed =====
  readonly isCashBoxIdValid = computed(() => {
    const me = this.editExpense();
    return !!me?.cashBoxId && Number(me.cashBoxId) > 0;
  });

  readonly isDescriptionValid = computed(() => {
    const v = this.editExpense();
    return v != null && v.description.trim().length > 0;
  })

  readonly isAmountValid = computed(() => {
    const v = this.editExpense();
    return v != null && Number(v.amount) > 0;
  });

  readonly isDateValid = computed(() => {
    const v = this.editExpense() ;
    return v != null && v.date.trim().length === 10;
  });

  readonly formValid = computed(() => 
    this.isCashBoxIdValid() && 
    this.isDescriptionValid() && 
    this.isAmountValid() && 
    this.isDateValid()
  );

  // ===== Metodos privados =====
  // Compara si los datos actuales son iguales a los originales
  private isSame(): boolean {
    const originalExpense = this.monthlyExpense();
    const editExpense = this.editExpense();
    return (
      originalExpense!.cashBoxId === editExpense!.cashBoxId &&
      originalExpense!.description === editExpense!.description &&
      originalExpense!.amount === editExpense!.amount &&
      originalExpense!.date === editExpense!.date
    );
  }
  // ===== Métodos públicos =====
  /* Valida y envía el formulario si los campos obligatorios están completos.*/
  submitForm(): void {
    if (!this.formValid()) {
      this.notification.warn('Warn', 'Please fill in all required fields correctly: ' + [
        !this.isCashBoxIdValid() && '"CashBoxId"',
        !this.isDescriptionValid() && '"Description"',
        !this.isAmountValid() && '"Amount"',
        !this.isDateValid() && '"Date"'
      ].filter(Boolean).join(', '));
      return;
    }

    if (this.isSame()) {
      this.notification.warn('warn', 'Please edit the box before saving.');
      return;
    }
    const editExpense = this.editExpense();
    if (editExpense) {
    this.edit.emit(editExpense);
    this.close.emit();
    }
  }

  patchEdit(patch: Partial<MonthlyExpenseDTO>) {
      this.editExpense.update(e => (e ? { ...e, ...patch } : e));
  }

  onCancel(): void {
    this.close.emit();
  }


}
