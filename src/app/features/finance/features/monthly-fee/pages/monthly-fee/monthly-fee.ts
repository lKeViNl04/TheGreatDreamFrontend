import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { MonthlyFeeDTO } from '../../models/monthly-fee-dto';
import { MonthlyFeeAdd } from '../../components/monthly-fee-add/monthly-fee-add';
import { MonthlyFeeEdit } from '../../components/monthly-fee-edit/monthly-fee-edit';
import { MonthlyFeeDelete } from '../../components/monthly-fee-delete/monthly-fee-delete';
import { MonthlyFeeService } from '../../services/monthly-fee-service';
import { MemberService } from '../../../../../member/services/member-service';
import { CashboxService } from '../../../cashbox/services/cashbox-service';
import { NotificationService } from '../../../../../../services/notification-service/notification-service';

import { SearchInput } from '../../../../../../components/search-input/search-input';
import { AddButton } from '../../../../../../components/add-button/add-button';
import { PaginationComponent } from '../../../../../../components/pagination/pagination';
import { AccordionTable } from '../../../../components/accordion-table/accordion-table';

import type { TableColumn } from '../../../../../../components/generic-table/generic-table';
import { NotResultsFound } from '../../../../../../components/not-results-found/not-results-found';
import { Box } from '../../../../components/accordion-table/accordion-table';

@Component({
  selector: 'app-monthly-fee',
  standalone: true,
  imports: [
    CommonModule,
    SearchInput,
    AddButton,
    PaginationComponent,
    AccordionTable,
    MonthlyFeeAdd,
    MonthlyFeeEdit,
    MonthlyFeeDelete,
    NotResultsFound
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './monthly-fee.html',
})
export class MonthlyFee {
  // ===== Inyección de servicios =====
  private readonly cashboxService = inject(CashboxService);
  private readonly monthlyFeeService = inject(MonthlyFeeService);
  private readonly memberService = inject(MemberService);
  private readonly notification = inject(NotificationService);

  // ===== Datos iniciales =====
  readonly cashboxes = toSignal(
    this.cashboxService.getAllCashbox(),
    { initialValue: [] }
  );

  readonly members = toSignal(
    this.memberService.getAllMembers(),
    { initialValue: [] }
  );

  // ===== Estado  =====
  readonly monthlyFee = signal<MonthlyFeeDTO[]>([]);
  readonly currentPage = signal(1);
  readonly pageSize = signal(5);
  readonly searchTerm = signal('');

  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedMonthlyFee = signal<MonthlyFeeDTO | null>(null);

  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member+ID', type: 'member' },
    { key: 'assignedAmount', label: 'Assigned Amount', type: 'currency' },
    { key: 'paid', label: 'Paid', type: 'currency' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  // ===== Opciones select (Computed) =====
  readonly optionSelectCashboxId = computed(() =>
    this.cashboxes().map(c => ({ value: c.id, label: `CAJA ${c.id}` }))
  );

  readonly optionSelectMemberId = computed(() =>
    this.members().map(m => ({ value: m, label: `${m.firstName} ${m.lastName}` }))
  );

  // ===== Agrupación y filtrado (Computed) =====
  readonly accordionData = computed(() => this.groupByCashbox(this.monthlyFee()));

  readonly filteredAccordionData = computed(() => {
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
  });

  // ===== Constructor =====
  constructor() {
    this.loadMonthlyFee();
  }

  // ===== Métodos privados =====
  private loadMonthlyFee() {
    this.monthlyFeeService.getAllMonthlyFee().subscribe(data => {
      this.monthlyFee.set(data);
      this.notification.success('Success', 'Monthly Fee loaded successfully');
    });
  }

  // ===== Helpers =====
  private groupByCashbox(data: MonthlyFeeDTO[]): Box[] {
    const groups: Record<number, MonthlyFeeDTO[]> = {};
    data.forEach((fee) => {
      if (!groups[fee.cashBoxId]) groups[fee.cashBoxId] = [];
      groups[fee.cashBoxId].push(fee);
    });
    return Object.entries(groups).map(([cashboxId, items]) => ({
      id: Number(cashboxId),
      name: `Caja ${cashboxId}`,
      type: 'fee',
      items
    }));
  }

  // ===== Métodos publico =====
  // ===== CRUD =====
  addMonthlyFee(newMonthlyFee: MonthlyFeeDTO) {
    this.monthlyFeeService.addMonthlyFee(newMonthlyFee).subscribe(saved => {
      this.monthlyFee.update(fees => [...fees, saved]);
      this.notification.success('Success', 'Monthly Fee added successfully');
      this.showAddModal.set(false);
    });
  }

  openEditModal(fee: MonthlyFeeDTO) {
    this.selectedMonthlyFee.set(fee);
    this.showEditModal.set(true);
  }

  updateMonthlyFee(updatedFee: MonthlyFeeDTO) {
    this.monthlyFeeService.updateMonthlyFee(updatedFee).subscribe(updated => {
      this.monthlyFee.update(fees => fees.map(f => f.id === updated.id ? updated : f));
      this.notification.success('Success', 'Monthly Fee updated successfully');
      this.showEditModal.set(false);
    });
  }

  openDeleteModal(fee: MonthlyFeeDTO) {
    this.selectedMonthlyFee.set(fee);
    this.showDeleteModal.set(true);
  }

  deleteMonthlyFee(id: number) {
    this.monthlyFeeService.deleteMonthlyFee(id).subscribe(() => {
      this.monthlyFee.update(fees => fees.filter(f => f.id !== id));
      this.notification.success('Success', 'Monthly Fee deleted successfully');
      this.showDeleteModal.set(false);
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

}
