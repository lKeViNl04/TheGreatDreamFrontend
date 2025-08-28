import { Component, computed, input } from '@angular/core';

import { MemberDTO } from '../../models/member-dto';
import { BaseFormDelete } from '../../../../shared/abstract/base-form-delete';
import { ModalConfirm } from '../../../../shared/mod/modal-confirm/modal-confirm';

@Component({
  selector: 'app-member-delete',
  standalone: true,
  imports: [ModalConfirm],
  templateUrl: './member-delete.html'
})
export class MemberDelete extends BaseFormDelete<MemberDTO>{
  // ===== Inputs & Outputs =====
  readonly entity = input.required<MemberDTO>();
  // ===== Estados internos =====
  readonly memberFirstname = computed(() => this.entity()?.firstName ?? '');
  readonly memberLastname = computed(() => this.entity()?.lastName ?? '');
}
