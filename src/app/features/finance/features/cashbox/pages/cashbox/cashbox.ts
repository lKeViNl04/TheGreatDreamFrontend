import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CashboxService } from '../../services/cashbox-service';
import { CashboxDTO } from '../../models/cashbox-dto';
import { CashboxAdd } from '../../components/cashbox-add/cashbox-add';
import { CashboxEdit } from '../../components/cashbox-edit/cashbox-edit';
import { CashboxDelete } from '../../components/cashbox-delete/cashbox-delete';

import { NotificationService } from '../../../../../../services/notification-service/notification-service';
import { PaginationComponent } from '../../../../../../components/pagination/pagination';
import { SearchInput } from '../../../../../../components/search-input/search-input';
import { GenericTable } from '../../../../../../components/generic-table/generic-table';
import { AddButton } from '../../../../../../components/add-button/add-button';


import type { TableRow,TableColumn } from '../../../../../../components/generic-table/generic-table';

@Component({
  selector: 'app-cashbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchInput,
    AddButton,
    GenericTable,
    PaginationComponent,
    CashboxAdd,
    CashboxEdit,
    CashboxDelete
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './cashbox.html',
})
export class Cashbox {
  // ===== Inyección de servicios =====
  private readonly cashboxService = inject(CashboxService);
  private readonly notification = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);
  private readonly currencyPipe = inject(CurrencyPipe);
  // ===== Estados =====
  readonly cashbox = signal<CashboxDTO[]>([]);

  readonly currentPage = signal(1);
  readonly pageSize = signal(5)
  readonly searchTerm = signal('');

  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly selectedCashbox = signal<CashboxDTO | null>(null);

  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'year', label: 'Year' },
    { key: 'month', label: 'Month' },
    { key: 'amountCollected', label: 'Amount Collected' },
    { key: 'totalSpent', label: 'Spent' },
    { key: 'balance', label: 'Balance' },
  ];
  // ===== Computed =====
  readonly filteredCashbox = computed (()=> {
      const term = this.searchTerm().trim().toLowerCase();
      if (!term.includes(':')) {
        return this.cashbox().filter(c =>
          c.id.toString().toLowerCase().includes(term) ||
          c.month.toString().toLowerCase().includes(term) ||
          c.year.toString().toLowerCase().includes(term)
        );
      }
      const [key, value] = term.split(':').map(t => t.trim());
      return this.cashbox().filter(c =>
        String((c as any)[key] ?? '').toLowerCase().includes(value)
      );
    }
  );

  readonly totalPages = computed(() => 
    Math.ceil(this.filteredCashbox().length / this.pageSize()));

  readonly pageData = computed(() => {
      const start = (this.currentPage() - 1) * this.pageSize();
      return this.filteredCashbox().slice(start, start + this.pageSize());
    }
  );

  readonly tableData = computed<TableRow[]>(() => {
      return this.pageData().map((cashbox) => ({
        original: cashbox,
        id: cashbox.id,
        month: this.datePipe.transform(new Date(cashbox.year, cashbox.month - 1), 'LLLL')?.toUpperCase() ?? '',
        year: cashbox.year,
        amountCollected: this.currencyPipe.transform(cashbox.amountCollected, '', 'symbol', '1.0-2') ?? '',
        totalSpent: this.currencyPipe.transform(cashbox.totalSpent, '', 'symbol', '1.0-2') ?? '',
        balance: this.currencyPipe.transform(cashbox.balance, '', 'symbol', '1.0-2') ?? ''
      }));
    }
  );

  readonly totals = computed(() => {
  const filtered = this.filteredCashbox();
      return {
        amountCollected: filtered.reduce((sum, c) => sum + c.amountCollected, 0),
        spent: filtered.reduce((sum, c) => sum + c.totalSpent, 0),
        balance: filtered.reduce((sum, c) => sum + c.balance, 0),
      };
    }
  );
  // ===== Ciclo de vida =====
  /*Inicializa el componente cargando la caja*/
  constructor() {
    this.loadCashbox();
  }
  // ===== Métodos privados =====
  /*Carga todos los registros de caja desde el servicio*/
  private loadCashbox(): void {
      this.cashboxService.getAllCashbox().subscribe(data => {
          this.cashbox.set(data);
          this.notification.success('Success', 'Cashbox loaded successfully');
      }
    )
  }
  // ===== Métodos publico =====
  // ===== Métodos CRUD =====
  /*Agrega un nuevo Cashbox*/
  addCashbox(newCashbox: CashboxDTO): void {
      this.cashboxService.addCashbox(newCashbox).subscribe(data =>{
        this.cashbox.update(c => [...c, data]);
        this.notification.success('Success', 'Cashbox added successfully');
        this.showAddModal.set(false);
      }
    );
  }
  /*Abre el modal de edición*/
  openEditModal(cashbox: CashboxDTO): void {
    this.selectedCashbox.set(cashbox);
    this.showEditModal.set(true);
  }
  /*Actualiza un Cashbox existente*/
  updateCashbox(updatedCashbox: CashboxDTO): void {
    this.cashboxService.updateCashbox(updatedCashbox).subscribe(data =>{
      this.cashbox.update(c => c.map(c => c.id === data.id ? data : c));
      this.notification.success('Success', 'Cashbox updated successfully');
      this.showEditModal.set(false);
    });
  }
  /*Abre el modal de eliminación*/
  openDeleteModal(cashbox: CashboxDTO): void {
    this.selectedCashbox.set(cashbox);
    this.showDeleteModal.set(true);
  }
  /*Elimina un Cashbox por id*/
  deleteCashbox(id: number): void {
    this.cashboxService.deleteCashbox(id).subscribe(data =>{
      this.cashbox.update(c => c.filter(c => c.id !== id));
      this.notification.success('Success', 'Cashbox deleted successfully');
      this.showDeleteModal.set(false);
    });
  }
  onPageChange(page: number) {
    this.currentPage.set(page);
  }
  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }
}
