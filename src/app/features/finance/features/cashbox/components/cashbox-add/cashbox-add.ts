import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CashboxDTO } from '../../models/cashbox-dto';

import { FormSelect } from '../../../../../../components/form-select/form-select';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';

@Component({
  selector: 'app-cashbox-add',
  standalone: true,
  imports: [CommonModule, FormsModule, FormSelect],
  templateUrl: './cashbox-add.html',
   
})
export class CashboxAdd {
  // ===== Inyección de servicios =====
  private notification = inject(NotificationService);

  // ===== Outputs =====
  readonly close = output<void>();
  readonly save = output<CashboxDTO>();

  // ===== Estados internos =====
  readonly cashbox = signal<Partial<CashboxDTO>>({
    year: new Date().getFullYear(), // 2025
    month: new Date().getMonth() + 1, // devuelve 1–12 como number  
  });

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
  // ===== Compúted =====
  readonly isYearValid = computed(() => {
    const year = this.cashbox().year;
    return year && year.toString().length === 4;
  }
  );

  readonly isMonthValid = computed(() => {
    const month = this.cashbox().month;
    return month && month >= 1 && month <= 12;
  }
  );

  readonly isFormValid = computed(() =>
    this.isYearValid() && this.isMonthValid());

  // ===== Métodos públicos =====
  /*Valida y envía el formulario si los campos obligatorios están completos.*/
  submitForm(): void {
    if (!this.isFormValid()) {
      const c = this.cashbox();
      const payload: CashboxDTO = {
        ...(c as CashboxDTO),
        year: c.year ? c.year : new Date().getFullYear(),
        month: c.month ? c.month : new Date().getMonth() + 1,
      };
      this.save.emit(payload);
      this.close.emit();
      return;
    } else {
      this.notification.warn('Warn', 'Please fill in all required fields correctly: ' + [
        !this.isMonthValid() && '"Month"',
        !this.isYearValid() && '"Year"',
      ].filter(Boolean).join(', '));
      console.warn('Formulario inválido', {
        month: this.isMonthValid(),
        year: this.isYearValid()
      });
    }
  }

  patchCashbox(patch: Partial<CashboxDTO>) {
    this.cashbox.update(c => ({ ...c, ...patch }));
  }

  onCancel(): void {
    this.close.emit();
  }

}
