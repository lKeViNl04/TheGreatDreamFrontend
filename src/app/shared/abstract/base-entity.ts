import { computed, effect, inject, signal } from '@angular/core';
import { NotificationService } from '../../services/notification-service/notification-service';
import { TableColumn } from '../components/generic-table/table';
import { applyFilter } from '../helper/applyFilter';
import { BaseService } from './base-service';

export abstract class BaseEntity<T extends { id: number }> {
    // ===== Inyección de servicios =====
    readonly notification = inject(NotificationService);
    // ===== Estados comunes =====
    readonly entity = signal<T[]>([]);
    readonly currentPage = signal(1);
    readonly pageSize = signal(7);
    readonly searchTerm = signal('');
    readonly showAddModal = signal(false);
    readonly showEditModal = signal(false);
    readonly showDeleteModal = signal(false);
    readonly selectedEntity = signal<T | null>(null);
    abstract readonly tableColumns: TableColumn[];
    protected abstract service: BaseService<T>;
    //===== Constructor =====
    constructor() {
        effect(() => {
            const _ = this.searchTerm();  // leer el valor activa el effect
            this.currentPage.set(1);
        });
    }
    // ===== Computed comunes =====
    readonly totalPages = computed(() =>
        Math.max(1, Math.ceil(this.filteredEntity().length / this.pageSize()))
    );
    readonly pageData = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredEntity().slice(start, end);
    });
    readonly filteredEntity = computed(() => {
        return applyFilter(this.searchTerm(), this.entity(), this.tableColumns);
    });
    // ===== Métodos CRUD genéricos =====
    loadData() {
        this.service.getAll().subscribe(data => {
            this.entity.set(data);
            this.notification.success('Success', `${this.service.entityName} loaded successfully`);
        });
    }
    addEntity(entity: T) {
        this.service.add(entity).subscribe(saved => {
            this.entity.update(items => [...items, saved]);
            this.notification.success('Success', `${this.service.entityName} added successfully`);
            this.showAddModal.set(false);
        });
    }
    updateEntity(entity: T) {
        this.service.update(entity).subscribe(updated => {
            this.entity.update(items => items.map(i => i.id === updated.id ? updated : i));
            this.notification.success('Success', `${this.service.entityName} updated successfully`);
            this.showEditModal.set(false);
        });
    }
    deleteEntity(id: number) {
        this.service.delete(id).subscribe(() => {
            this.entity.update(items => items.filter(i => i.id !== id));
            this.notification.success('Success', `${this.service.entityName} deleted successfully`);
            this.showDeleteModal.set(false);
        });
    }
    // ===== Helpers de modales =====
    openAddModal() { this.showAddModal.set(true); }
    openEditModal(entity: T) {
        this.selectedEntity.set(entity);
        this.showEditModal.set(true);
    }
    openDeleteModal(entity: T) {
        this.selectedEntity.set(entity);
        this.showDeleteModal.set(true);
    }
    // ===== Paginación & búsqueda =====
    onPageChange(page: number) {
        this.currentPage.set(page);
    }
}
