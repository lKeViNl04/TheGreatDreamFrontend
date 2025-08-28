import { Component, inject, ChangeDetectionStrategy, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';

import { FormSelect } from '../../../../../../components/form-select/form-select';
import { FormInput } from '../../../../../../components/form-input/form-input';
import { FormTextarea } from '../../../../../../components/form-textarea/form-textarea';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';


@Component({
  selector: 'app-monthly-expense-add',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormTextarea, FormSelect],
  templateUrl: './monthly-expense-add.html',
   
})
export class MonthlyExpenseAdd {
    // ===== Inyección de servicios =====
  private notification = inject(NotificationService);

  // ===== Outputs & Input =====
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  readonly close = output<void>();
  readonly save = output<MonthlyExpenseDTO>();

  // ===== Estados internos =====
  readonly monthlyExpense = signal<Partial<MonthlyExpenseDTO>> ({
    description: '',
    amount: 0,
    date: ''
  });
  
  // ===== Ciclo de vida =====
  constructor () {
    // Efecto para actualizar el cashBoxId cuando se selecciona una caja
    effect(() => {
      const cb = this.cashboxOptions()?.[0]?.value;
      this.monthlyExpense.update(m => ({ ...m, cashBoxId: cb ?? undefined }));
    }
    );
  }
  // ===== Computed properties =====
  readonly isCashBoxIdValid = computed(() => {
    const m = this.monthlyExpense();
    return !!m.cashBoxId && Number(m.cashBoxId) > 0;
  });

  readonly isDescriptionValid = computed(() => {
    const v = this.monthlyExpense().description;
    return v != null && v.trim().length > 0;
  });

  readonly isAmountValid = computed(() => {
    const v = this.monthlyExpense().amount;
    return v != null && Number(v) > 0;
  });

  readonly isDateValid = computed(() => {
    const v = this.monthlyExpense().date;
    return v != null && v.trim().length === 10; // Formato YYYY-MM-DD
  });

  readonly formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isDescriptionValid() &&
    this.isAmountValid() &&
    this.isDateValid()
  );

  
  // ===== Metodo publico =====
  submitForm(): void {
    if(this.formValid()) {
      const me = this.monthlyExpense();
      const payload: MonthlyExpenseDTO = {
        ...(me as MonthlyExpenseDTO),
        cashBoxId: Number(me.cashBoxId),
        amount: Number(me.amount),
        date: me.date as string,
        description: me.description as string
      };
      this.save.emit(payload);
      this.close.emit();
    } else {
      this.notification.warn('Warn', 'Please fill in all required fields correctly: ' + [
        !this.isCashBoxIdValid() && '"CashBoxId"',
        !this.isDescriptionValid() && '"Description"',
        !this.isAmountValid() && '"Amount"',
        !this.isDateValid() && '"Date"'
      ].filter(Boolean).join(', '));
      console.warn('Formulario inválido', {
        cashBoxId: this.isCashBoxIdValid(),
        description: this.isDescriptionValid(),
        amount: this.isAmountValid(),
        date: this.isDateValid(),
      });
    }
  }

  patchMonthlyExpense(patch: Partial<MonthlyExpenseDTO>) {
      this.monthlyExpense.update(me => ({ ...me, ...patch }));
  }

  onCancel(): void {
    this.close.emit();
  }

}
