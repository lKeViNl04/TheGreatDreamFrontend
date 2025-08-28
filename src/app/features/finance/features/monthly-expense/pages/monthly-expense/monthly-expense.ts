import { Component,computed,inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';
import { MonthlyExpenseService } from '../../services/monthly-expense-service';
import { MonthlyExpenseAdd } from '../../components/monthly-expense-add/monthly-expense-add';
import { MonthlyExpenseEdit } from '../../components/monthly-expense-edit/monthly-expense-edit';
import { MonthlyExpenseDelete } from '../../components/monthly-expense-delete/monthly-expense-delete';

import { CashboxService } from '../../../cashbox/services/cashbox-service';

import { AccordionTable } from '../../../../components/accordion-table/accordion-table';

import type { TableColumn } from '../../../../../../shared/components/generic-table/table';

import { EntityLayout } from "../../../../../../shared/layout/entity-layout/entity-layout";
import { CurrencyColumnStrategy, DateColumnStrategy, TextColumnStrategy } from '../../../../../../shared/components/generic-table/column-strategy';
import { ExpenseBoxStrategy } from '../../../../components/accordion-table/box-strategy';
import { BaseAccordionEntity } from '../../../../../../shared/abstract/base-accordion-entity';
@Component({
  selector: 'app-monthly-expense',
  standalone: true,
  imports: [
    AccordionTable,
    MonthlyExpenseAdd,
    MonthlyExpenseEdit,
    MonthlyExpenseDelete,
    EntityLayout
],
  providers : [DatePipe, CurrencyPipe],
  templateUrl: './monthly-expense.html',
})
export class MonthlyExpense extends BaseAccordionEntity<MonthlyExpenseDTO> {
  // ===== Inyección de servicios =====
  protected readonly service = inject(MonthlyExpenseService);
  private readonly cashboxService = inject(CashboxService);
  private readonly currencyPipe = inject(CurrencyPipe)
  private readonly datePipe = inject(DatePipe)
  // ===== Datos iniciales =====
  readonly cashboxes = toSignal(
    this.cashboxService.getAll(),
    { initialValue: [] }
  );
  // ===== Estados =====
  override readonly tableColumns: TableColumn [] = [
    { key: 'id', label: 'ID', strategy: new TextColumnStrategy() },
    { key: 'description', label: 'Description', strategy: new TextColumnStrategy() },
    { key: 'amount', label: 'Amount', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
    { key: 'date', label: 'Date', strategy: new DateColumnStrategy(this.datePipe) },
  ];
  protected makeStrategy() {
    return new ExpenseBoxStrategy(this.currencyPipe);
  }
  // ===== Constructor =====
  constructor() {super();this.loadData();}
  // ===== Opciones select (Computed) =====
  readonly optionSelectCashboxId = computed(() =>
    this.cashboxes().map(c => ({ value: c.id, label: `CAJA ${c.id}` }))
  );
}
