import { Component, input, output, computed, inject, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SearchInput } from '../../../../components/search-input/search-input';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { GenericTable } from '../../../../components/generic-table/generic-table';

import type { TableRow, TableColumn } from '../../../../components/generic-table/generic-table';

// Types for stronger typing and better maintenance

type BoxType = 'fee' | 'expense';

export interface Box<T = any> {
  id: number;
  name: string;
  type: BoxType;
  items: T[];
}

@Component({
  selector: 'app-accordion-table',
  standalone: true,
  imports: [CommonModule, SearchInput, PaginationComponent, GenericTable],
  templateUrl: './accordion-table.html',
  providers: [],
   
})
export class AccordionTable {
  // ===== Inputs/Outputs =====
  readonly boxes = input.required<Box<TableRow>[]>();
  readonly columns = input.required<TableColumn[]>();
  readonly pageSize = input(5);
  readonly edit = output<any>();
  readonly delete = output<any>();

  // ===== Signals for UI state =====
  readonly boxesSignal = signal<Box<TableRow>[]>([]);
  readonly columnsSignal = signal<TableColumn[]>([]);
  readonly openedBoxId = signal<number | null>(null);
  readonly searchTerms = signal<Record<number, string>>({});
  readonly currentPages = signal<Record<number, number>>({});

  constructor() {
    effect(() => this.boxesSignal.set(this.boxes()));
    effect(() => this.columnsSignal.set(this.columns()));
  }

  // ===== Inyección de servicios =====
  private readonly datePipe = inject(DatePipe);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly sanitizer = inject(DomSanitizer);

  // ===== Métodos privado =====
  private readonly statusClasses: Record<string, string> = {
    'Pagado': 'bg-green-500 text-green-900',
    'Pagado con Transferencia': 'bg-green-500 text-green-900',
    'No pagado': 'bg-red-500 text-red-950',
    'Pago parcial': 'bg-yellow-400 text-yellow-900'
  };

  private getStatusClass(status: string): string {
    return this.statusClasses[status] || '';
  }

  private formatCell(item: any, col: TableColumn): string | SafeHtml {
    const rawValue = item?.[col.key];

    // Formateo especial para MemberDTO: "First Last (ID)"
    if (col.key === 'member' && rawValue && typeof rawValue === 'object') {
      return this.formatMember(rawValue);
    }

    if (col.type === 'currency') {
      return this.currencyPipe.transform(Number(rawValue) || 0, '', 'symbol', '1.0-2') ?? '';
    }

    if (col.type === 'date') {
      return rawValue ? (this.datePipe.transform(rawValue, 'MMM d, y')?.toUpperCase() ?? 'NULL') : 'NULL';
    }

    // Keep compatibility with GenericTable that expects HTML in some cells
    if (col.type === 'status' || col.key === 'status') {
      const badgeClass = this.getStatusClass(String(rawValue ?? ''));
      const content = String(rawValue ?? '');
      // Trust the generated HTML (content is escaped) so styling works with [innerHTML]
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="px-2 py-1 text-xs font-bold uppercase rounded ${badgeClass}">${content}</span>`
      );
    }

    return String(rawValue ?? '');
  }

  private formatMember(member: any): string {
    const firstName = String(member?.firstName ?? '').trim();
    const lastName = String(member?.lastName ?? '').trim();
    const id = member?.id != null ? String(member.id) : '';
    const fullName = `${firstName} ${lastName}`.trim();
    return id ? `${fullName} (${id})` : fullName || '';
  }

  // ===== Métodos públicos =====
  toggleBox(boxId: number): void {
    this.openedBoxId.update(current => (current === boxId ? null : boxId));
  }

  filteredItems = (box: Box) => computed(() => {
  const search = (this.searchTerms()[box.id] || '').toLowerCase();
  const items = box.items || [];
  if (!search) return items;

  return items.filter(item =>
    this.columnsSignal().some(col => String(item[col.key] ?? '').toLowerCase().includes(search))
  );
  });

  paginatedItems = (box: Box) => computed(() => {
  const filtered = this.filteredItems(box)();
  const page = this.currentPages()[box.id] || 1;
  const start = (page - 1) * this.pageSize();

  return filtered.slice(start, start + this.pageSize()).map(item => {
    const row: TableRow = { original: item };
    this.columnsSignal().forEach(col => {
      row[col.key] = this.formatCell(item, col);
    });
    return row;
  });
  });

  totalPages = (box: Box) => computed(() => {
  const total = this.filteredItems(box)().length;
  return Math.max(1, Math.ceil(total / this.pageSize()));
  });


  getTotalAmount(box: Box): string {
    const items = box.items || [];

    if (box.type === 'fee') {
      const totalAssigned = items.reduce((sum: number, item: any) => sum + (Number(item.assignedAmount) || 0), 0);
      const totalPaid = items.reduce((sum: number, item: any) => sum + (Number(item.paid) || 0), 0);
      const formattedAssigned = this.currencyPipe.transform(totalAssigned, '', 'symbol', '1.0-2');
      const formattedPaid = this.currencyPipe.transform(totalPaid, '', 'symbol', '1.0-2');
      return `${formattedAssigned ?? ''} / ${formattedPaid ?? ''}`;
    }

    // Default: expense
    const total = items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    return this.currencyPipe.transform(total, '', 'symbol', '1.0-2') ?? '';
  }

  getTotalLabel(box: Box): string {
    return box.type === 'fee' ? 'Total Assigned / Paid' : 'Total Spent';
  }

  onPageChange(boxId: number, page: number): void {
    this.currentPages.update(current => ({ ...current, [boxId]: page }));
  }

  updateSearchTerm(boxId: number, term: string): void {
    this.searchTerms.update(current => ({ ...current, [boxId]: term?.trim() ?? '' }));
    this.resetPage(boxId);
  }

  resetPage(boxId: number): void {
    this.currentPages.update(current => ({ ...current, [boxId]: 1 }));
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(item: any): void {
    this.delete.emit(item);
  }

}


