import { Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MemberService } from '../../services/member-service';
import { MemberDTO } from '../../models/member-dto';
import { MemberAdd } from '../../components/member-add/member-add';
import { MemberEdit } from '../../components/member-edit/member-edit';
import { MemberDelete } from '../../components/member-delete/member-delete';

import { GenericTable } from '../../../../shared/components/generic-table/generic-table';

import type { TableRow, TableColumn } from '../../../../shared/components/generic-table/table';

import { BaseEntity } from '../../../../shared/abstract/base-entity';
import { EntityLayout } from "../../../../shared/layout/entity-layout/entity-layout";
import { MemberFullNameColumnStrategy, MemberStatementColumnStrategy, StatusColumnStrategy, TextColumnStrategy } from '../../../../shared/components/generic-table/column-strategy';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MemberAdd,
    MemberEdit,
    MemberDelete,
    GenericTable,
    EntityLayout
  ],
  templateUrl: './member.html',
})

export class Member extends BaseEntity<MemberDTO> {
  // ===== Inyección de servicios =====
  protected readonly service = inject(MemberService);
  private readonly sanitizer = inject(DomSanitizer)
  // ===== Estados =====
  override readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', strategy: new TextColumnStrategy() },
    { key: 'member', label: 'Member', strategy: new MemberFullNameColumnStrategy(this.sanitizer), valueGetter: (member: MemberDTO) => member},
    { key: 'slot', label: 'Slot', strategy: new TextColumnStrategy() },
    { key: 'status', label: 'Status', strategy: new StatusColumnStrategy(this.sanitizer) },
    { key: 'statement', label: 'Statement', strategy: new MemberStatementColumnStrategy(this.sanitizer), valueGetter:(member: MemberDTO) => member}
  ];
  //===== Constructor =====
  constructor() { super(); this.loadData(); }
  // ===== Computed =====
  readonly tableData = computed<TableRow[]>(() =>
    this.pageData().map(member => {
      const row: TableRow = { original: member };
      this.tableColumns.forEach(col => {
        const value = col.valueGetter ? col.valueGetter(member) : member[col.key as keyof MemberDTO];
        row[col.key] = col.strategy.render(value);
      });
      return row;
    }
    )
  );
}
