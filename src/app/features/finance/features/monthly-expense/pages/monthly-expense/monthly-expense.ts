import { Component,computed,inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { MonthlyExpenseDTO } from '../../models/monthly-expense-dto';
import { MonthlyExpenseService } from '../../services/monthly-expense-service';
import { MonthlyExpenseAdd } from '../../components/monthly-expense-add/monthly-expense-add';
import { MonthlyExpenseEdit } from '../../components/monthly-expense-edit/monthly-expense-edit';
import { MonthlyExpenseDelete } from '../../components/monthly-expense-delete/monthly-expense-delete';

import { CashboxService } from '../../../cashbox/services/cashbox-service';

import { NotificationService } from '../../../../../../services/notification-service/notification-service';
import { SearchInput } from '../../../../../../components/search-input/search-input';
import { AddButton } from '../../../../../../components/add-button/add-button';
import { PaginationComponent } from '../../../../../../components/pagination/pagination';
import { AccordionTable } from '../../../../components/accordion-table/accordion-table';

import type { TableColumn } from '../../../../../../components/generic-table/generic-table';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotResultsFound } from '../../../../../../components/not-results-found/not-results-found';
import { Box } from '../../../../components/accordion-table/accordion-table';
@Component({
  selector: 'app-monthly-expense',
  standalone: true,
  imports: [
    CommonModule,
    AddButton,
    PaginationComponent,
    SearchInput,
    AccordionTable,
    MonthlyExpenseAdd,
    MonthlyExpenseEdit,
    MonthlyExpenseDelete,
    NotResultsFound
  ],
  providers : [DatePipe, CurrencyPipe],
  templateUrl: './monthly-expense.html',
})
export class MonthlyExpense {
  // ===== Inyección de servicios =====
  private readonly cashboxService = inject(CashboxService);
  private readonly monthlyExpenseService = inject(MonthlyExpenseService);
  private readonly notification = inject(NotificationService);

  // ===== Datos iniciales =====
  readonly cashboxes = toSignal(
    this.cashboxService.getAllCashbox(),
    { initialValue: [] }
  );
  // ===== Estados =====
  readonly monthlyExpense = signal<MonthlyExpenseDTO[]>([]);
  readonly currentPage = signal(1);
  readonly pageSize = signal(5);
  readonly searchTerm = signal('');

  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly selectedMonthlyExpense = signal<MonthlyExpenseDTO | null>(null);

  readonly tableColumns: TableColumn [] = [
    { key: 'id', label: 'ID' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'date', label: 'Date', type: 'date' },
  ];
  // ===== Computed =====
  readonly optionSelectCashboxId = computed(() =>
    this.cashboxes().map(c => ({ value: c.id, label: `CAJA ${c.id}` }))
  );

  readonly accordionData = computed(() => this.groupByCashbox(this.monthlyExpense()));

  readonly filteredAccordionData = computed (() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.accordionData().filter(box =>
      box.name.toLowerCase().includes(term)
    );
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredAccordionData().length / this.pageSize())
  );

  readonly pageData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredAccordionData().slice(start, end);
  }
  );
  // ===== Constructor =====
  constructor() {
    this.loadMonthlyExpense();
  }
  // ===== Métodos privados =====
  /*Carga todos los registros de caja desde el servicio*/
  private loadMonthlyExpense(): void {
    this.monthlyExpenseService.getAllMonthlyExpense().subscribe(data=>{
      this.monthlyExpense.set(data);
      this.notification.success("Success","Monthly Expenses loaded successfully");
    });
  }
  /*Agrupa los gastos por ID de caja y los transforma en una estructura compatible con acordeones.*/
  private groupByCashbox(data: MonthlyExpenseDTO[]): Box[] {
    const groups: Record<number, MonthlyExpenseDTO[]> = {};
    data.forEach((expense) => {
      if (!groups[expense.cashBoxId]) groups[expense.cashBoxId] = [];
      groups[expense.cashBoxId].push(expense);
    });
    return Object.entries(groups).map(([cashboxId, items]) => ({
      id: Number(cashboxId), 
      name: `Caja ${cashboxId}`,
      type: 'expense',
      items
    }));
  }
  //====== Metodos publicos ======
  // ===== Métodos CRUD =====
  /* Agrega un nuevo Monthly Expense*/
  addMonthlyExpense(newMonthlyExpense: MonthlyExpenseDTO): void {
    this.monthlyExpenseService.addMonthlyExpense(newMonthlyExpense).subscribe(saved => {
      this.monthlyExpense.update(expenses => [...expenses, saved]);
      this.notification.success('Success', 'Monthly Expense added successfully');
      this.showAddModal.set(false);
    });
  }
  /*Abre el edit modal*/
  openEditModal(expense: MonthlyExpenseDTO): void {
    this.selectedMonthlyExpense.set(expense);
    this.showEditModal.set(true);
  }
  /*Actualiza un Monthly Expense existente*/
  updateMonthlyExpense(updateMonthlyExpense: MonthlyExpenseDTO): void {
    this.monthlyExpenseService.updateMonthlyExpense(updateMonthlyExpense).subscribe(updated => {
        this.monthlyExpense.update(expenses => expenses.map(e => e.id === updated.id ? updated : e));
        this.notification.success('Success', 'Monthly Expense updated successfully');
        this.showEditModal.set(false);
      });
  }
  /*Abre el modal de eliminación*/
  openDeleteModal(expense: MonthlyExpenseDTO): void {
    this.selectedMonthlyExpense.set(expense);
    this.showDeleteModal.set(true);
  }
  /*Elimina un MonthlyExpense por id*/
  deleteMonthlyExpense(id: number): void {
    this.monthlyExpenseService.deleteMonthlyExpense(id).subscribe(() => {
      this.monthlyExpense.update(expenses => expenses.filter(e => e.id !== id));
      this.notification.success('Success', 'Monthly Expense deleted successfully');
      this.showDeleteModal.set(false);
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

}
