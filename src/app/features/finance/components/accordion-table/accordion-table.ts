import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Box } from './box';
import { TableColumn } from '../../../../shared/components/generic-table/table';
import { AccordionBox } from './accordion-box';
import { CurrencyColumnStrategy,DateColumnStrategy,TextColumnStrategy } from '../../../../shared/components/generic-table/column-strategy';
import { FeeBoxStrategy, ExpenseBoxStrategy } from './box-strategy';
import { NotResultsFound } from "../../../../shared/components/not-results-found/not-results-found";

@Component({
  selector: 'app-accordion-table',
  standalone: true,
  imports: [CommonModule, AccordionBox, NotResultsFound],
  providers: [CurrencyPipe, DatePipe],
  template: `
  @if(boxes().length > 0){
    @for (box of boxes(); track box.id) {
      <app-accordion-box [box]="box" [columns]="columns()"
      (edit)="edit.emit($event)" (delete)="delete.emit($event)" />
    }
  }@else{
    <app-not-results-found />
  }
`,
})
export class AccordionTable {
  readonly boxes = input.required<Box[]>();
  readonly columns = input.required<TableColumn[]>();
  readonly edit = output<any>();
  readonly delete = output<any>();
}
