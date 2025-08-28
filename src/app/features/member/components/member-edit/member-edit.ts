import { Component, computed } from '@angular/core';

import { MemberDTO } from '../../models/member-dto';

import { FormInput } from '../../../../shared/components/form-input/form-input';
import { FormSelect } from '../../../../shared/components/form-select/form-select';
import { BaseFormEdit } from '../../../../shared/abstract/base-form-edit';
import { ModalShell } from '../../../../shared/mod/modal-shell/modal-shell';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [FormInput, FormSelect, ModalShell],
  templateUrl: './member-edit.html'
})

export class MemberEdit extends BaseFormEdit<MemberDTO>{
  // ===== Estados internos =====
  readonly statuses: { value: string, label: string }[] = [
    { value: 'Activo', label: 'ACTIVO' },
    { value: 'EXmiembro', label: 'EXMIEMBRO' }
  ];
  // ====== Constructor ====
  constructor() {super();}
  // ===== Propiedades computadas =====
  readonly isFirnameValid = computed(() => {
    const mem = this.editEntity();
    return mem ? mem.firstName?.trim().length > 0 : false;
  });
  readonly isLastnameValid = computed(() => {
    const mem = this.editEntity();
    return mem ? mem.lastName?.trim().length > 0 : false;
  });
  readonly isSlotsValid = computed(() => {
    const mem = this.editEntity();
    return mem ? mem.slot?.trim().length > 0 : false;
  });
  readonly isStatusValid = computed(() => {
    const mem = this.editEntity();
    return mem ? this.statuses.some(status => status.value === mem.status) : false;
  });
  // ===== Override =====
  override formValid = computed(() =>
    this.isFirnameValid() && this.isLastnameValid() &&
    this.isSlotsValid() && this.isStatusValid()
  );

  protected override isSame(): boolean {
    const originalMember = this.entity();
    const editableMember = this.editEntity();
    if (!originalMember || !editableMember) return false;
    return (
      originalMember.firstName === editableMember.firstName &&
      originalMember.lastName === editableMember.lastName &&
      originalMember.slot === editableMember.slot &&
      originalMember.status === editableMember.status
    );
  }
  override invalidFields(): string[] {
    return [
      !this.isFirnameValid() && "First Name",
      !this.isLastnameValid() && "Last Name",
      !this.isSlotsValid() && "Slots",
      !this.isStatusValid() && "Status"
    ].filter(Boolean) as string[];
  }
}
