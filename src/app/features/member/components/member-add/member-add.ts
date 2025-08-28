import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MemberDTO } from '../../models/member-dto';

import { FormInput } from '../../../../components/form-input/form-input';
import { FormSelect } from '../../../../components/form-select/form-select';
import { NotificationService } from '../../../../services/notification-service/notification-service';

@Component({
  selector: 'app-member-add',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput, FormSelect],
  templateUrl: './member-add.html',
   
})

export class MemberAdd {
  // ===== Inyección de servicios =====
  private readonly notification = inject(NotificationService);
  // ===== Outputs =====
  readonly close = output<void>();
  readonly save = output<MemberDTO>();
  // ===== Estados internos =====
  readonly member = signal<Partial<MemberDTO>>({
    firstName: '',
    lastName: '',
    slots: '',
    status: undefined
  });

  readonly statuses: { value: string, label: string }[] = [
    { value: 'Activo', label: 'ACTIVO' },
    { value: 'EXmiembro', label: 'EXMIEMBRO' }
  ];
  // ===== Computed properties ====
  readonly isFirstNameValid = computed(() => (this.member().firstName ?? '').trim().length > 0);
  readonly isLastNameValid = computed(() => (this.member().lastName ?? '').trim().length > 0)
  readonly isSlotsValid = computed(() => (this.member().slots ?? '').trim().length > 0);
  readonly isStatusValid = computed(() => this.statuses.some(status => status.value === this.member().status));

  readonly isFormValid = computed(() =>
    this.isFirstNameValid() &&
    this.isLastNameValid() &&
    this.isSlotsValid() &&
    this.isStatusValid()
  );
  // ===== Métodos públicos =====
  /*Valida y envía el formulario si los campos obligatorios están completos.*/
  submitForm(): void {
    if (this.isFormValid()) {
      const m = this.member();
      const payload: MemberDTO = {
        ...(m as MemberDTO),
        firstName: m.firstName?.trim() || '',
        lastName: m.lastName?.trim() || '',
        slots: m.slots?.trim() || '',
        status: m.status?.trim() || ''
      }
      // Emitir el evento de guardado con el DTO completo
      this.save.emit(payload);
      this.close.emit();
    } else {
      this.notification.warn('Warn', 'Please fill in all required fields correctly: ' + [
        !this.isFirstNameValid() && '"FirstName"',
        !this.isLastNameValid() && '"LastName"',
        !this.isSlotsValid() && '"Slots"',
        !this.isStatusValid() && '"Status"'
      ].filter(Boolean).join(', '));
      console.warn('Formulario inválido', {
        firstName: this.isFirstNameValid(),
        lastName: this.isLastNameValid(),
        slots: this.isSlotsValid(),
        status: this.isStatusValid()
      });
    }
  }

  patchMember(patch: Partial<MemberDTO>) {
    this.member.update(m => ({ ...m, ...patch }));
  }

  onCancel(): void {
    this.close.emit();
  }
}
