import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MemberDTO } from '../../models/member-dto';

import { FormInput } from '../../../../components/form-input/form-input';
import { FormSelect } from '../../../../components/form-select/form-select';
import { NotificationService } from '../../../../services/notification-service/notification-service';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormSelect],
  templateUrl: './member-edit.html',
   
})

export class MemberEdit {
  // ===== Inyección de servicios =====
  private readonly notification = inject(NotificationService);
  // ===== Inputs & Outputs =====
  readonly editMember = signal<MemberDTO | null>(null);
  readonly member = input<MemberDTO | null>(null);
  readonly close = output<void>();
  readonly edit = output<MemberDTO>();

  // ===== Estados internos =====
  readonly statuses: { value: string, label: string }[] = [
    { value: 'Activo', label: 'ACTIVO' },
    { value: 'EXmiembro', label: 'EXMIEMBRO' }
  ];
  // ====== Constructor ====
  constructor() {
    effect(() => {
      const mem = this.member();
      this.editMember.set(mem ? structuredClone(mem) : null);
    });
  }
  // ===== Propiedades computadas =====
  readonly isFirnameValid = computed(() => {
    const mem = this.editMember();
    return mem ? mem.firstName?.trim().length > 0 : false;
  });
  readonly isLastnameValid = computed(() => {
    const mem = this.editMember();
    return mem ? mem.lastName?.trim().length > 0 : false;
  });
  readonly isSlotsValid = computed(() => {
    const mem = this.editMember();
    return mem ? mem.slots?.trim().length > 0 : false;
  });
  readonly isStatusValid = computed(() => {
    const mem = this.editMember();
    return mem ? this.statuses.some(status => status.value === mem.status) : false;
  });

  readonly formValid = computed(() =>
    this.isFirnameValid() &&
    this.isLastnameValid() &&
    this.isSlotsValid() &&
    this.isStatusValid()
  );

  // ===== Metodos privados =====
  private isSame(): boolean {
    const originalMember = this.member();
    const editableMember = this.editMember();
    if (!originalMember || !editableMember) return false;
    return (
      originalMember.firstName === editableMember.firstName &&
      originalMember.lastName === editableMember.lastName &&
      originalMember.slots === editableMember.slots &&
      originalMember.status === editableMember.status
    );
  }
  // ===== Métodos públicos =====
  submitForm(): void {
    if (!this.formValid()) {
      this.notification.warn('Warning', 'Please fill in all required fields ' +
        [
          !this.isFirnameValid() ? 'First Name' : '',
          !this.isLastnameValid() ? 'Last Name' : '',
          !this.isSlotsValid() ? 'Slots' : '',
          !this.isStatusValid() ? 'Status' : ''
        ].filter(Boolean).join(', ')
      );
      return;
    }
    if (this.isSame()) {
      this.notification.info('Info', 'No changes detected');
      return;
    }
    const member = this.editMember();
    if (member) {
      this.edit.emit(member);
      this.close.emit();
    }
  }

  patchEdit(patch: Partial<MemberDTO>): void {
    this.editMember.update(m => (m ? { ...m, ...patch } : m));
  }

  onCancel(): void {
    this.close.emit();
  }
}
