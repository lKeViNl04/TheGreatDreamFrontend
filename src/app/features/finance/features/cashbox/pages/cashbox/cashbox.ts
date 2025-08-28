import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

import { CashboxService } from '../../services/cashbox-service';
import { CashboxDTO } from '../../models/cashbox-dto';
import { CashboxAdd } from '../../components/cashbox-add/cashbox-add';
import { CashboxEdit } from '../../components/cashbox-edit/cashbox-edit';
import { CashboxDelete } from '../../components/cashbox-delete/cashbox-delete';

import { GenericTable } from '../../../../../../shared/components/generic-table/generic-table';

import type { TableRow, TableColumn } from '../../../../../../shared/components/generic-table/table';

import { BaseEntity } from '../../../../../../shared/abstract/base-entity';
import { EntityLayout } from "../../../../../../shared/layout/entity-layout/entity-layout";
import { CurrencyColumnStrategy, DateMonthColumnStrategy, TextColumnStrategy } from '../../../../../../shared/components/generic-table/column-strategy';

@Component({
  selector: 'app-cashbox',
  standalone: true,
  imports: [
    CommonModule,
    GenericTable,
    CashboxAdd,
    CashboxEdit,
    CashboxDelete,
    EntityLayout
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './cashbox.html',
})
export class Cashbox extends BaseEntity<CashboxDTO> {
  // ===== Inyección de servicios =====
  protected readonly service = inject(CashboxService);
  private readonly datePipe = inject(DatePipe);
  private readonly currencyPipe = inject(CurrencyPipe);
  // ===== Estados =====
  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', strategy: new TextColumnStrategy() },
    { key: 'year', label: 'Year', strategy: new TextColumnStrategy() },
    { key: 'month', label: 'Month', strategy: new DateMonthColumnStrategy(this.datePipe) },
    { key: 'totalCollected', label: 'Collected', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
    { key: 'totalSpent', label: 'Spent', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
    { key: 'totalBalance', label: 'Balance', strategy: new CurrencyColumnStrategy(this.currencyPipe) },
  ];
  // ===== Constructor =====
  constructor() { super(); this.loadData(); }
  // ===== Computed =====
  readonly tableData = computed<TableRow[]>(() => 
      this.pageData().map(cashbox => { 
        const row: TableRow = { original: cashbox }; 
        this.tableColumns.forEach(col => { 
          const key = col.key as keyof CashboxDTO; 
          row[col.key] = col.strategy.render(cashbox[key]); 
        });
        return row; 
      }
    )
  );

  readonly totals = computed(() => {
    const filtered = this.filteredEntity();
    return {
      amountCollected: filtered.reduce((sum, c) => sum + c.totalCollected, 0),
      spent: filtered.reduce((sum, c) => sum + c.totalSpent, 0),
      balance: filtered.reduce((sum, c) => sum + c.totalBalance, 0),
    };
  }
  );
}
