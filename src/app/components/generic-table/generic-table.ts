import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { NotResultsFound } from '../not-results-found/not-results-found';

// Tipos fuertes para mejorar mantenibilidad y seguridad de tipos
export interface TableColumn 
{
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'status' | (string & {});
}
export type TableRow = { original: any } & Record<string, string | SafeHtml>;

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [NotResultsFound],
  templateUrl: './generic-table.html',
  styleUrls: ['./generic-table.scss'],
   
})
export class GenericTable {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<TableRow[]>([]);

  readonly edit = output<any>();
  readonly delete = output<any>();

  onEdit(item: TableRow): void {
    this.edit.emit(item.original);
  }

  onDelete(item: TableRow): void {
    this.delete.emit(item.original);
  }

  // Sugerido para usar en la plantilla con @for/*ngFor para evitar recreación de filas
  trackRowBy = (index: number, row: TableRow) => (row?.original as any)?.id ?? index;
}
