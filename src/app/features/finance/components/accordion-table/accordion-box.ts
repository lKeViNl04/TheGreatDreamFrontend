import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Box } from './box';
import { TableColumn } from '../../../../shared/components/generic-table/table';
import { BoxTable } from './box-table';

@Component({
    selector: 'app-accordion-box',
    standalone: true,
    imports: [CommonModule, BoxTable],
    template: `
        <div class="mb-4 border border-white/10 rounded-lg overflow-hidden">
        <button (click)="toggle()" class="w-full flex justify-between items-center px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold">
            <span>{{ box().name }}</span>
            <svg [ngClass]="{ 'rotate-180': opened() }" class="w-5 h-5 transition-transform">
            <use xlink:href="/icons/sprite.svg#Dropdown" />
            </svg>
        </button>

        @if (opened()) {
            <div class="px-4 py-4 bg-white/5 text-white">
            <app-box-table [box]="box()" [columns]="columns()" 
            (edit)="edit.emit($event)" (delete)="delete.emit($event)"/>
            </div>
        }

        <div class="px-4 py-2 bg-white/10 text-white font-semibold">
            {{ box().strategy.getLabel() }}: {{ box().strategy.getTotal(box().items) }}
        </div>
        </div>
    `
})
export class AccordionBox {
    readonly box = input.required<Box>();
    readonly columns = input.required<TableColumn[]>();
    readonly opened = signal(false);
    readonly edit = output<any>();
    readonly delete = output<any>();

    toggle() { this.opened.update(o => !o); }
}
