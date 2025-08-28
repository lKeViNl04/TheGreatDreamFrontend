import { Component, inject, ChangeDetectionStrategy, output, signal, input, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';

import { FormInput } from '../../../../../../components/form-input/form-input';
import { FormSelect } from '../../../../../../components/form-select/form-select';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';
import { MemberDTO } from '../../../../../member/models/member-dto';

@Component({
  selector: 'app-monthly-fee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormSelect],
  templateUrl: './monthly-fee-edit.html',
   
})
export class MonthlyFeeEdit {
  // ===== Inyección de servicios =====
  private readonly notification = inject(NotificationService);
  // ===== Inputs & Outputs =====
  readonly editFee = signal<MonthlyFeeDTO | null>(null);
  readonly monthlyFee = input<MonthlyFeeDTO | null>(null);
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  readonly memberOptions = input<{ value: MemberDTO; label: string }[]>([]);
  readonly close = output<void>();
  readonly edit = output<MonthlyFeeDTO>();

  // ===== Estados =====
  readonly statusOptions: { value: any, label: string }[] = [
    { value: "Pagado", label: "PAGADO" },
    { value: "Pagado con Transferencia", label: "PAGO C/ TRANSF" },
    { value: "Pago parcial", label: "PAGO PARCIAL" },
    { value: "No pagado", label: "NO PAGADO" }
  ]
  // ====== Constructor ====
  constructor() {
    // Sincronizar editableFee cada vez que monthlyFee cambia
    effect(() => {
      const fee = this.monthlyFee();
      this.editFee.set(fee ? structuredClone(fee) : null);
    });

    effect(() => {
      const fee = this.editFee();
      const members = this.memberOptions();
      if (fee && fee.member && members.length > 0) {
        const matchedMember = members.find(m => m.value.id === fee.member.id);
        if (matchedMember && matchedMember.value !== fee.member) {
          this.editFee.update(f => f ? { ...f, member: matchedMember.value } : f);
        }
      }
    });
  }
  // ====== Computed ====
  readonly isCashBoxIdValid = computed(() => {
    const fee = this.editFee();
    return !!fee?.cashBoxId && Number(fee.cashBoxId) > 0;
  });

  readonly isMemberIdValid = computed(() => {
    const fee = this.editFee();
    return fee?.member?.id != null && fee.member.id > 0;
  });

  readonly isAssignedAmountValid = computed(() => {
    const fee = this.editFee();
    return fee?.assignedAmount != null && Number(fee.assignedAmount) > 0;
  });

  readonly isPaidValid = computed(() => {
    const fee = this.editFee();
    return fee?.paid != null && Number(fee.paid) >= 0;
  });

  readonly isStatusValid = computed(() => {
    const fee = this.editFee();
    return this.statusOptions.some(o => o.value === fee?.status);
  });

  readonly formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isMemberIdValid() &&
    this.isAssignedAmountValid() &&
    this.isPaidValid() &&
    this.isStatusValid()
  );
  // ===== Metodos privados =====
  private isSame(): boolean {
    const originalFee = this.monthlyFee();
    const editableFee = this.editFee();
    if (!originalFee || !editableFee) return true;
    return (
      originalFee.cashBoxId === editableFee.cashBoxId &&
      originalFee.member.id === editableFee.member.id &&
      originalFee.assignedAmount === editableFee.assignedAmount &&
      originalFee.paid === editableFee.paid &&
      originalFee.status === editableFee.status
    );
  }
  // ===== Métodos public =====
  submitForm(): void {
    if (!this.formValid()) {
      this.notification.warn(
        'Warn',
        'Please fill in all required fields correctly: ' +
        [
          !this.isCashBoxIdValid() && '"Cashbox"',
          !this.isMemberIdValid() && '"Member"',
          !this.isAssignedAmountValid() && '"Assigned Amount"',
          !this.isPaidValid() && '"Paid"',
          !this.isStatusValid() && '"Status"',
        ].filter(Boolean).join(', ')
      );
      return;
    }
    if (this.isSame()) {
      this.notification.warn('Warn', 'Please edit the box before saving.');
      return;
    }
    const editFee = this.editFee();
    if (editFee) {
      this.edit.emit(editFee);
      this.close.emit();
    }
  }

  patchEdit(patch: Partial<MonthlyFeeDTO>) {
    this.editFee.update(f => (f ? { ...f, ...patch } : f));
  }
  onCancel(): void {
    this.close.emit();
  }

}
