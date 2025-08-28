import { Component, input, effect, computed } from '@angular/core';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';

import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { MemberDTO } from '../../../../../member/models/member-dto';
import { BaseFormEdit } from '../../../../../../shared/abstract/base-form-edit';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-monthly-fee-edit',
  standalone: true,
  imports: [FormInput, FormSelect, ModalShell],
  templateUrl: './monthly-fee-edit.html',
})
export class MonthlyFeeEdit extends BaseFormEdit<MonthlyFeeDTO> {
  // ===== Inputs & Outputs =====
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  readonly memberOptions = input<{ value: MemberDTO; label: string }[]>([]);
  // ===== Estados =====
  readonly statusOptions: { value: any, label: string }[] = [
    { value: "Pagado", label: "PAGADO" },
    { value: "Pagado con Transferencia", label: "PAGO C/ TRANSF" },
    { value: "Pago parcial", label: "PAGO PARCIAL" },
    { value: "No pagado", label: "NO PAGADO" }
  ]
  // ====== Constructor ====
  constructor() {
    super();
    effect(() => {
      const fee = this.editEntity();
      const members = this.memberOptions();
      if (fee && fee.member && members.length > 0) {
        const matchedMember = members.find(m => m.value.id === fee.member.id);
        if (matchedMember && matchedMember.value !== fee.member) {
          this.editEntity.update(f => f ? { ...f, member: matchedMember.value } : f);
        }
      }
    });
  }
  // ====== Computed ====
  readonly isCashBoxIdValid = computed(() => {
    const fee = this.editEntity();
    return !!fee?.cashBoxId && Number(fee.cashBoxId) > 0;
  });

  readonly isMemberIdValid = computed(() => {
    const fee = this.editEntity();
    return fee?.member?.id != null && fee.member.id > 0;
  });

  readonly isAssignedAmountValid = computed(() => {
    const fee = this.editEntity();
    return fee?.assignedAmount != null && Number(fee.assignedAmount) > 0;
  });

  readonly isPaidValid = computed(() => {
    const fee = this.editEntity();
    return fee?.paid != null && Number(fee.paid) >= 0;
  });

  readonly isStatusValid = computed(() => {
    const fee = this.editEntity();
    return this.statusOptions.some(o => o.value === fee?.status);
  });
  // ===== Override =====
  override formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isMemberIdValid() &&
    this.isAssignedAmountValid() &&
    this.isPaidValid() &&
    this.isStatusValid()
  );

  protected override isSame(): boolean {
    const originalFee = this.entity();
    const editableFee = this.editEntity();
    if (!originalFee || !editableFee) return true;
    return (
      originalFee.cashBoxId === editableFee.cashBoxId &&
      originalFee.member.id === editableFee.member.id &&
      originalFee.assignedAmount === editableFee.assignedAmount &&
      originalFee.paid === editableFee.paid &&
      originalFee.status === editableFee.status
    );
  }

  override invalidFields(): string[] {
    return [
      !this.isCashBoxIdValid() && '"Cashbox"',
      !this.isMemberIdValid() && '"Member"',
      !this.isAssignedAmountValid() && '"Assigned Amount"',
      !this.isPaidValid() && '"Paid"',
      !this.isStatusValid() && '"Status"',
    ].filter(Boolean) as string[];
  }
}
