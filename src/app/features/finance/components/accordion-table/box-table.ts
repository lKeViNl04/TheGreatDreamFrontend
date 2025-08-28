import { Component, input, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Box } from './box';
import { TableColumn, TableRow } from '../../../../shared/components/generic-table/table';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { GenericTable } from '../../../../shared/components/generic-table/generic-table';
import { applyFilter } from '../../../../shared/helper/applyFilter';

@Component({
    selector: 'app-box-table',
    standalone: true,
    imports: [CommonModule, SearchInput, PaginationComponent, GenericTable],
    template: `

        <app-search-input class="pb-1"
        [searchTerm]="searchTerm()"
        (searchTermChange)="updateSearch($event)"/>

        <app-generic-table
        [columns]="columns()"
        [data]="paginatedRows()" 
        (edit)="edit.emit($event)"
        (delete)="delete.emit($event)"/>

        <app-pagination
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        (pageChanged)="goToPage($event)" />
    `
})

export class BoxTable{
    readonly box = input.required<Box>();
    readonly columns = input.required<TableColumn[]>();
    readonly pageSize = input(5);

    readonly searchTerm = signal('');
    readonly currentPage = signal(1);
    readonly edit = output<any>();
    readonly delete = output<any>();

    readonly filteredItems = computed(() => {
        return applyFilter(this.searchTerm(), this.box().items, this.columns());
    });


    readonly paginatedRows = computed<TableRow[]>(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        return this.filteredItems().slice(start, start + this.pageSize()).map(item => {
        const row: TableRow = { original: item };
        this.columns().forEach(col => row[col.key] = col.strategy.render(item[col.key]));
        return row;
        });
    });

    readonly totalPages = computed(() =>
        Math.max(1, Math.ceil(this.filteredItems().length / this.pageSize()))
    );

    updateSearch(term: string) {
        this.searchTerm.set(term);
        this.currentPage.set(1);
    }

    goToPage(p: number) { this.currentPage.set(p); }
}
