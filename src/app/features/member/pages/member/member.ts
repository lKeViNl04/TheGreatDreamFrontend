import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MemberService } from '../../services/member-service';
import { MemberDTO } from '../../models/member-dto';
import { MemberAdd } from '../../components/member-add/member-add';
import { MemberEdit } from '../../components/member-edit/member-edit';
import { MemberDelete } from '../../components/member-delete/member-delete';

import { NotificationService } from '../../../../services/notification-service/notification-service';
import { PaginationComponent } from '../../../../components/pagination/pagination';
import { GenericTable } from '../../../../components/generic-table/generic-table';
import { AddButton } from '../../../../components/add-button/add-button';
import { SearchInput } from '../../../../components/search-input/search-input';

import type { TableRow, TableColumn } from '../../../../components/generic-table/generic-table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MemberAdd,
    MemberEdit,
    MemberDelete,
    SearchInput,
    AddButton,
    GenericTable,
    PaginationComponent,
  ],
  templateUrl: './member.html',
})

export class Member {
  // ===== Inyección de servicios =====
  private readonly memberService = inject(MemberService);
  private readonly notification = inject(NotificationService);
  private readonly sanitizer = inject(DomSanitizer)

  // ===== Estados =====
  readonly members = signal<MemberDTO[]>([]);

  readonly currentPage = signal(1);
  readonly pageSize = signal(5);
  readonly searchTerm = signal('');

  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly selectedMember = signal<MemberDTO | null>(null);

  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member' },
    { key: 'slots', label: 'Slots' },
    { key: 'status', label: 'Status' },
  ];

  // ===== Computed =====
  // Computed para filtrar según término de búsqueda
  readonly filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term.includes(':')) {
      return this.members().filter(m =>
        m.firstName.toLowerCase().includes(term) ||
        m.lastName.toLowerCase().includes(term) ||
        m.status.toLowerCase().includes(term) ||
        m.id?.toString().includes(term) ||
        m.slots?.toString().includes(term) ||
        (m.id?.toString().includes(term) ?? false)
      );
    }
    const [key, value] = term.split(':').map(t => t.trim());
    return this.members().filter(m =>
      String((m as any)[key] ?? '').toLowerCase().includes(value)
    );
  });

  // Computed para total de páginas basado en filteredMembers
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredMembers().length / this.pageSize())));

  // Computed para datos de la página actual (slice paginado)
  readonly pageData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredMembers().slice(start, start + this.pageSize());
  });

  // Computed que mapea pageData a TableRow[] con sanitización para el componente tabla
  readonly tableData = computed<TableRow[]>(() => {
    return this.pageData().map(member => ({
      original: member,
      id: member.id ?? '',
      member: this.sanitizer.bypassSecurityTrustHtml(`
        <div class="flex items-center gap-3">
          <img src="imgs/User.svg" alt="${member.firstName} ${member.lastName}"
            class="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover" />
          <p class="text-blue-gray-900">${member.firstName} ${member.lastName}</p>
        </div>
      `),
      slots: member.slots,
      status: this.sanitizer.bypassSecurityTrustHtml(`
        <span class="px-2 py-1 text-xs font-bold uppercase rounded 
          ${member.status === 'Activo' ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-950'}">
          ${member.status}
        </span>
      `),
    }));
  });

  // ===== Constructor =====
  constructor() {
    this.loadMembers();
  }

  // ===== Métodos privados =====
  private loadMembers() {
    this.memberService.getAllMembers().subscribe(data => {
      this.members.set(data);
      this.notification.success('Success', 'Members loaded successfully');
    }
    );
  }

  // ===== Métodos publico =====
  // ===== Métodos CRUD =====
  /*Agrega un nuevo miembro*/
  addMember(newMember: MemberDTO): void {
    this.memberService.addMember(newMember).subscribe(saved => {
      this.members.update(members => [...members, saved]);
      this.notification.success('Success', 'Member successfully added');
      this.showAddModal.set(false);
    });
  }

  /*Abre el modal de edición*/
  openEditModal(member: MemberDTO): void {
    this.selectedMember.set(member);
    this.showEditModal.set(true);
  }

  /*Actualiza un miembro existente*/
  updateMember(updated: MemberDTO): void {
    this.memberService.updateMember(updated).subscribe(updated => {
      this.members.update(members => members.map(m => m.id === updated.id ? updated : m));
      this.notification.success('Success', 'Member successfully updated');
      this.showEditModal.set(false);
    });
  }

  /*Abre el modal de eliminación*/
  openDeleteModal(member: MemberDTO): void {
    this.selectedMember.set(member);
    this.showDeleteModal.set(true);
  }

  /*Elimina un miembro por id*/
  deleteMember(id: number): void {
    this.memberService.deleteMember(id).subscribe(() => {
      this.members.update(members => members.filter(m => m.id !== id));
      this.notification.success('Success', 'Member successfully deleted');
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
