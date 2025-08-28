import { Component, computed } from '@angular/core';

import { MemberDTO } from '../../models/member-dto';

import { FormInput } from '../../../../shared/components/form-input/form-input';
import { FormSelect } from '../../../../shared/components/form-select/form-select';
import { BaseFormAdd } from '../../../../shared/abstract/base-form-add';
import { ModalShell } from '../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-member-add',
  standalone: true,
  imports: [FormInput, FormSelect, ModalShell],
  templateUrl: './member-add.html',
})

export class MemberAdd extends BaseFormAdd<MemberDTO>{
  // ===== Estados =====
  readonly statuses: { value: string, label: string }[] = [
    { value: 'Activo', label: 'ACTIVO' },
    { value: 'EXmiembro', label: 'EXMIEMBRO' }
  ];
  // ===== Constructor =====
  constructor(){
    super();
    this.entity.set({
      firstName: '',
      lastName: '',
      slot: '',
      status: undefined
    });
  }
  // ===== Computed properties =====
  readonly isFirstNameValid = computed(() => (this.entity().firstName ?? '').trim().length > 0);
  readonly isLastNameValid = computed(() => (this.entity().lastName ?? '').trim().length > 0)
  readonly isSlotsValid = computed(() => (this.entity().slot ?? '').trim().length > 0);
  readonly isStatusValid = computed(() => this.statuses.some(status => status.value === this.entity().status));
  //===== Override =====
  override formValid = computed(() =>
    this.isFirstNameValid() &&
    this.isLastNameValid() &&
    this.isSlotsValid() &&
    this.isStatusValid()
  );

  override buildPayload(e: Partial<MemberDTO>): MemberDTO {
    return {
      ...(e as MemberDTO),
      firstName: e.firstName?.trim() || '',
      lastName: e.lastName?.trim() || '',
      slot: e.slot?.trim() || '',
      status: e.status?.trim() || ''
    };
  }

  override invalidFields(): string[] {
    return [
      !this.isFirstNameValid() && '"FirstName"',
      !this.isLastNameValid()  && '"LastName"',
      !this.isSlotsValid()     && '"Slot"',
      !this.isStatusValid()    && '"Status"',
    ].filter(Boolean) as string[];
  }
}
