import { Component, inject, ChangeDetectionStrategy, signal, output, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CashboxDTO } from '../../models/cashbox-dto';

import { FormSelect } from '../../../../../../components/form-select/form-select';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';


@Component({
  selector: 'app-cashbox-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormSelect],
  templateUrl: './cashbox-edit.html',
   
})
export class CashboxEdit {
  // ===== Inyección de servicios =====
  private readonly notification = inject(NotificationService);
  // ===== Inputs & Outputs =====
  readonly editCashbox = signal<CashboxDTO | null>(null);
  readonly cashbox = input<CashboxDTO | null>(null);

  readonly close = output<void>();
  readonly edit = output<CashboxDTO>();
  // ===== Estados internos =====
  readonly years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year };
  });

  readonly months: { label: string, value: number }[] = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  // ====== Constructor ====
  constructor() {
    effect(() => {
    const cashbox = this.cashbox();
    this.editCashbox.set(cashbox ? structuredClone(cashbox) : null);
    });
  }
  // ===== Propiedades computadas =====
  readonly isMonthValid = computed(() => {
    const cashbox = this.editCashbox();
    return cashbox ? cashbox.month && cashbox.month >= 1 && cashbox.month <= 12 : false;
  }
  );
  readonly isYearValid = computed(() => {
    const cashbox = this.editCashbox();
    return cashbox ? cashbox.year?.toString().length === 4 : false;
  }
  );
  readonly formValid = computed(() =>
    this.isMonthValid() &&
    this.isYearValid()
  );
  // ===== Metodos privados =====
  // Compara si los datos actuales son iguales a los originales
  private isSame(): boolean {
    const originalCashbox = this.cashbox();
    const editableCashbox = this.editCashbox();
    if (!originalCashbox || !editableCashbox) return false;
    return (
      originalCashbox.month === editableCashbox.month &&
      originalCashbox.year === editableCashbox.year
    );
  }

  // ===== Métodos públicos =====
  /*Valida y envía el formulario si los campos obligatorios están completos.*/
  submitForm(): void {
    if (!this.formValid()) {
      this.notification.warn('Warn', 'Please fill in all required fields correctly: ' + [
        !this.isMonthValid() && '"Month"',
        !this.isYearValid() && '"Year"',
      ].filter(Boolean).join(', '));
      console.warn('Formulario inválido', {
        month: this.isMonthValid(),
        year: this.isYearValid()
      });
      return;
    }

    if (this.isSame()) {
      this.notification.warn('warn', 'Please edit the box before saving.');
      return;
    }
    const cashbox = this.editCashbox();
    if (cashbox) {
      this.edit.emit(cashbox);
      this.close.emit();
    }
  }

  patchEdit(patch: Partial<CashboxDTO>): void {
    this.editCashbox.update(c => c ? { ...c, ...patch } : c);
  }

  onCancel(): void {
    this.close.emit();
  }
}
