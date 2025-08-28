import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberDTO } from '../../models/member-dto';

@Component({
  selector: 'app-member-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-delete.html',
   
})
export class MemberDelete {
  // ===== Inputs & Outputs =====
  readonly member = input.required<MemberDTO>();
  readonly close = output<void>();
  readonly delete = output<number>();

  // ===== Estados internos =====
  readonly memberId = computed(() => this.member()?.id ?? null);
  readonly memberFirstname = computed(() => this.member()?.firstName ?? '');
  readonly memberLastname = computed(() => this.member()?.lastName ?? '');

  // ===== Métodos públicos =====
  onCancel() {
    this.close.emit();
  }

  onConfirm() {
    const id = this.memberId();
    if (id != null) {
      this.delete.emit(id);
      this.close.emit();
    }
  }

}
