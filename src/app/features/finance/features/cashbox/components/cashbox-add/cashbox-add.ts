import { Component, computed } from '@angular/core';

import { CashboxDTO } from '../../models/cashbox-dto';

import { FormSelect } from '../../../../../../shared/components/form-select/form-select';
import { BaseFormAdd } from '../../../../../../shared/abstract/base-form-add';
import { ModalShell } from '../../../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-cashbox-add',
  standalone: true,
  imports: [FormSelect, ModalShell],
  templateUrl: './cashbox-add.html',
})
export class CashboxAdd extends BaseFormAdd<CashboxDTO> {
  //===== Estados =====
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
  //===== Constructor =====
  constructor(){
    super();
    this.entity.set({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
  }
  //===== Computed properties =====
  readonly isYearValid = computed(() => {
    const year = this.entity().year;
    return year != null && year.toString().length === 4;
  }
  );

  readonly isMonthValid = computed(() => {
    const month = this.entity().month;
    return month!= null  && month >= 1 && month <= 12;
  }
  );
  //===== Override =====
  override formValid = computed(() =>
    this.isYearValid() && 
    this.isMonthValid()
  );

  override buildPayload(e: Partial<CashboxDTO>): CashboxDTO {
    return {
      ...(e as CashboxDTO),
      year: e.year ?? new Date().getFullYear(),
      month: e.month ?? new Date().getMonth() + 1,
    };
  }

  override invalidFields(): string[] {
    return [
      !this.isYearValid() && '"Year"',
      !this.isMonthValid() && '"Month"',
    ].filter(Boolean) as string[];
  }

}
