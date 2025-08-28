import { CurrencyPipe } from '@angular/common';

export interface BoxStrategy {
    getTotal(items: any[]): string;
    getLabel(): string;
}

export class FeeBoxStrategy implements BoxStrategy {
    constructor(private currency: CurrencyPipe) { }
    getTotal(items: any[]): string {
        const assigned = items.reduce((s, i) => s + (+i.assignedAmount || 0), 0);
        const paid = items.reduce((s, i) => s + (+i.paid || 0), 0);
        return `${this.currency.transform(assigned)} / ${this.currency.transform(paid)}`;
    }
    getLabel(): string { return 'Total Assigned / Paid'; }
}

export class ExpenseBoxStrategy implements BoxStrategy {
    constructor(private currency: CurrencyPipe) { }
    getTotal(items: any[]): string {
        const total = items.reduce((s, i) => s + (+i.amount || 0), 0);
        return this.currency.transform(total) ?? '';
    }
    getLabel(): string { return 'Total Spent'; }
}
