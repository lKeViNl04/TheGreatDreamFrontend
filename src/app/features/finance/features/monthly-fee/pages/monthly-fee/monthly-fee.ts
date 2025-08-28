import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';
import { MonthlyFeeAdd } from '../../components/monthly-fee-add/monthly-fee-add';
import { MonthlyFeeEdit } from '../../components/monthly-fee-edit/monthly-fee-edit';
import { MonthlyFeeDelete } from '../../components/monthly-fee-delete/monthly-fee-delete';
import { MonthlyFeeService } from '../../services/monthly-fee-service';
import { MemberService } from '../../../../../member/services/member-service';
import { CashboxService } from '../../../cashbox/services/cashbox-service';

import { AccordionTable } from '../../../../components/accordion-table/accordion-table';

import type { TableColumn } from '../../../../../../shared/components/generic-table/table';

import { EntityLayout } from "../../../../../../shared/layout/entity-layout/entity-layout";
import { CurrencyColumnStrategy, MemberFullNameColumnStrategy, StatusColumnStrategy, TextColumnStrategy } from '../../../../../../shared/components/generic-table/column-strategy';
import { DomSanitizer } from '@angular/platform-browser';
import { FeeBoxStrategy } from '../../../../components/accordion-table/box-strategy';
import { BaseAccordionEntity } from '../../../../../../shared/abstract/base-accordion-entity';

@Component({
  selector: 'app-monthly-fee',
  standalone: true,
  imports: [
    AccordionTable,
    MonthlyFeeAdd,
    MonthlyFeeEdit,
    MonthlyFeeDelete,
    EntityLayout
],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './monthly-fee.html',
})
export class MonthlyFee extends BaseAccordionEntity<MonthlyFeeDTO>  {
  // ===== Inyección de servicios =====
  protected readonly service = inject(MonthlyFeeService);
  private readonly cashboxService = inject(CashboxService);
  private readonly memberService = inject(MemberService);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly sanitize = inject(DomSanitizer);
  // ===== Datos iniciales =====
  readonly cashboxes = toSignal(
    this.cashboxService.getAll(),
    { initialValue: [] }
  );

  readonly members = toSignal(
    this.memberService.getAll(),
    { initialValue: [] }
  );
  // ===== Estado  =====
  override readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', strategy: new TextColumnStrategy() },
    { key: 'member', label: 'Member', strategy: new MemberFullNameColumnStrategy(this.sanitize) },
    { key: 'assignedAmount', label: 'Assigned Amount', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
    { key: 'paid', label: 'Paid', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
    { key: 'status', label: 'Status', strategy: new StatusColumnStrategy(this.sanitize) },
  ];

  protected makeStrategy() {
    return new FeeBoxStrategy(this.currencyPipe);
  }
  // ===== Constructor =====
  constructor() {super();this.loadData();}
  // ===== Opciones select (Computed) =====
  readonly optionSelectCashboxId = computed(() =>
    this.cashboxes().map(c => ({ value: c.id, label: `CAJA ${c.id}` }))
  );

  readonly optionSelectMemberId = computed(() =>
    this.members().map(m => ({ value: m, label: `${m.firstName} ${m.lastName}` }))
  );
}
