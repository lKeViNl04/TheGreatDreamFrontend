import { Component, output, input, signal, effect, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';

import { FormSelect } from '../../../../../../components/form-select/form-select';
import { FormInput } from '../../../../../../components/form-input/form-input';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';
import { MemberDTO } from '../../../../../member/models/member-dto';

@Component({
  selector: 'app-monthly-fee-add',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormSelect],
  templateUrl: './monthly-fee-add.html',
   
})
export class MonthlyFeeAdd {
  // ===== Inyección de servicios =====
  private readonly notification = inject(NotificationService);
  //  ===== Inputs/Outputs como señales =====
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  readonly memberOptions = input<{ value: any; label: string }[]>([]);
  readonly close = output<void>();
  readonly save = output<MonthlyFeeDTO>();
  // ===== Estados internos =====
  readonly monthlyFee = signal<Partial<MonthlyFeeDTO>>({
    assignedAmount: 0,
    paid: 0,
    status: undefined
  });

  readonly statusOptions: { value: any, label: string }[] = [
    { value: "Pagado", label: "PAGADO" },
    { value: "Pagado con Transferencia", label: "PAGO C/ TRANSF" },
    { value: "Pago parcial", label: "PAGO PARCIAL" },
    { value: "No pagado", label: "NO PAGADO" }
  ]

  // ===== Constructor =====
  constructor() {
    effect(() => {
      const cb = this.cashboxOptions()?.[0]?.value;
      const mem = this.memberOptions()?.[0]?.value;
      this.monthlyFee.update(m => ({ ...m, cashBoxId: cb ?? undefined, member: mem ?? undefined }));
    });
  }
  // ===== Computed properties =====
  readonly isCashBoxIdValid = computed(() => {
    const m = this.monthlyFee();
    return !!m.cashBoxId && Number(m.cashBoxId) > 0;
  });

  readonly isMemberIdValid = computed(() => this.monthlyFee().member != null);

  readonly isAssignedAmountValid = computed(() => {
    const v = this.monthlyFee().assignedAmount;
    return v != null && Number(v) > 0;
  });

  readonly isPaidValid = computed(() => {
    const v = this.monthlyFee().paid;
    return v != null && Number(v) >= 0;
  });

  readonly isStatusValid = computed(() =>
    this.statusOptions.some(o => o.value === this.monthlyFee().status)
  );

  readonly formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isMemberIdValid() &&
    this.isAssignedAmountValid() &&
    this.isPaidValid() &&
    this.isStatusValid()
  );
  // ===== Métodos públicos =====
  submitForm(): void {
    if (this.formValid()) {
      const mf = this.monthlyFee();
      const payload: MonthlyFeeDTO = {
        ...(mf as MonthlyFeeDTO),
        cashBoxId: Number(mf.cashBoxId),
        assignedAmount: Number(mf.assignedAmount),
        paid: Number(mf.paid),
        member: mf.member as MemberDTO,
      };
      this.save.emit(payload);
      this.close.emit();
    } else {
      this.notification.warn(
        'Warn',
        'Please fill in all required fields correctly: ' +
        [
          !this.isCashBoxIdValid() && '"Cashbox"',
          !this.isMemberIdValid() && '"Member"',
          !this.isAssignedAmountValid() && '"Assigned Amount"',
          !this.isPaidValid() && '"Paid"',
          !this.isStatusValid() && '"Status"',
        ]
          .filter(Boolean)
          .join(', ')
      );
      console.warn('Formulario inválido', {
        cashBoxId: this.isCashBoxIdValid(),
        member: this.isMemberIdValid(),
        assignedAmount: this.isAssignedAmountValid(),
        paid: this.isPaidValid(),
        status: this.isStatusValid(),
      });
    }
  }
  patchMonthlyFee(patch: Partial<MonthlyFeeDTO>) {
    this.monthlyFee.update(mf => ({ ...mf, ...patch }));
  }

  onCancel(): void {
    this.close.emit();
  }
}
