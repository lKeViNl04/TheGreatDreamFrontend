import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashboxDTO } from '../../models/cashbox-dto';
import { BaseFormDelete } from '../../../../../../shared/abstract/base-form-delete';
import { ModalConfirm } from '../../../../../../shared/mod/modal-confirm/modal-confirm';

@Component({
  selector: 'app-cashbox-delete',
  standalone: true,
  imports: [CommonModule, ModalConfirm],
  templateUrl: './cashbox-delete.html'
})
export class CashboxDelete extends BaseFormDelete<CashboxDTO>{
  // ===== Inputs & Outputs =====
  readonly entity = input.required<CashboxDTO>();
  // ===== Estados internos =====
  readonly cashBoxYear = computed(() => this.entity()?.year ?? '')
  readonly cashBoxMonth = computed(() => this.entity()?.month ?? '');
}
