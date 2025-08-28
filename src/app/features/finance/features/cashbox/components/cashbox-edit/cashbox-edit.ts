import { Component, computed} from '@angular/core';

import { CashboxDTO } from '../../models/cashbox-dto';

import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { BaseFormEdit } from '../../../../../../shared/abstract/base-form-edit';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';


@Component({
  selector: 'app-cashbox-edit',
  standalone: true,
  imports: [FormSelect, ModalShell],
  templateUrl: './cashbox-edit.html',
})
export class CashboxEdit extends BaseFormEdit<CashboxDTO>{
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
  constructor() {super();}
  // ===== Propiedades computadas =====
  readonly isMonthValid = computed(() => {
    const cashbox = this.editEntity();
    return cashbox ? cashbox.month >= 1 && cashbox.month <= 12 : false;
  });

  readonly isYearValid = computed(() => {
    const cashbox = this.editEntity();
    return cashbox ? cashbox.year?.toString().length === 4 : false;
  });
  // ===== Override =====
  override formValid = computed(() => this.isMonthValid() && this.isYearValid());

  protected override isSame(): boolean {
    const originalCashbox = this.entity();
    const editableCashbox = this.editEntity();
    if (!originalCashbox || !editableCashbox) return false;
    return (
      originalCashbox.month === editableCashbox.month &&
      originalCashbox.year === editableCashbox.year
    );
  }

  override invalidFields(): string[] {
    return [
      !this.isMonthValid() && '"Month"',
      !this.isYearValid() && '"Year"',
    ].filter(Boolean) as string[];
  }
}
