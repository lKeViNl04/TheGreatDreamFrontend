import { Component, input, effect, computed } from '@angular/core';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';

import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { MemberDTO } from '../../../../../member/models/member-dto';
import { BaseFormAdd } from '../../../../../../shared/abstract/base-form-add';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-monthly-fee-add',
  standalone: true,
  imports: [FormInput, FormSelect, ModalShell],
  templateUrl: './monthly-fee-add.html',
})
export class MonthlyFeeAdd extends BaseFormAdd<MonthlyFeeDTO> {
  //  ===== Inputs/Outputs como señales y estados=====
  readonly cashboxOptions = input<{ value: any; label: string }[]>([]);
  readonly memberOptions = input<{ value: any; label: string }[]>([]);

  readonly statusOptions: { value: any, label: string }[] = [
    { value: "Pagado", label: "PAGADO" },
    { value: "Pagado con Transferencia", label: "PAGO C/ TRANSF" },
    { value: "Pago parcial", label: "PAGO PARCIAL" },
    { value: "No pagado", label: "NO PAGADO" }
  ]

  // ===== Constructor =====
  constructor() {
    super();
    this.entity.set({
      assignedAmount: 0,
      paid: 0,
      status: undefined,
    });

    effect(() => {
      const cb = this.cashboxOptions()?.[0]?.value;
      const mem = this.memberOptions()?.[0]?.value;
      this.entity.update(m => ({ ...m, cashBoxId: cb ?? undefined, member: mem ?? undefined }));
    });
  }
  // ===== Computed properties =====
  readonly isCashBoxIdValid = computed(() => {
    const m = this.entity();
    return !!m.cashBoxId && Number(m.cashBoxId) > 0;
  });

  readonly isMemberIdValid = computed(() => this.entity().member != null);

  readonly isAssignedAmountValid = computed(() => {
    const v = this.entity().assignedAmount;
    return v != null && Number(v) > 0;
  });

  readonly isPaidValid = computed(() => {
    const v = this.entity().paid;
    return v != null && Number(v) >= 0;
  });

  readonly isStatusValid = computed(() =>
    this.statusOptions.some(o => o.value === this.entity().status)
  );

  // ===== Override =====
  override formValid = computed(() =>
    this.isCashBoxIdValid() &&
    this.isMemberIdValid() &&
    this.isAssignedAmountValid() &&
    this.isPaidValid() &&
    this.isStatusValid()
  );

  override buildPayload(e: Partial<MonthlyFeeDTO>): MonthlyFeeDTO {
    return {
      ...(e as MonthlyFeeDTO),
      cashBoxId: Number(e.cashBoxId),
      assignedAmount: Number(e.assignedAmount),
      paid: Number(e.paid),
      member: e.member as MemberDTO,
    };
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
