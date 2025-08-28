import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe, CurrencyPipe } from '@angular/common';

export interface ColumnStrategy {
    render(value: any): string | SafeHtml;
    searchValue?(value: any): string;
}
// --- Estrategias concretas ---
export class TextColumnStrategy implements ColumnStrategy {
    render(v: any): string { return String(v ?? '-'); }
    searchValue(v: any): string { return String(v ?? '').toLowerCase(); }
}

export class CurrencyColumnStrategy implements ColumnStrategy {
    constructor(private currency: CurrencyPipe) { }
    render(v: any): string { return this.currency.transform(v, '', 'symbol', '1.0-2') ?? '-'; }
    searchValue(v: any): string { return String(v ?? '').toLowerCase(); }
}

export class DateColumnStrategy implements ColumnStrategy {
    constructor(private date: DatePipe) { }
    render(v: any): string { return this.date.transform(v, 'MMM d, y')?.toUpperCase() ?? 'NULL'; }
    searchValue(v: any): string {return this.date.transform(v, 'yyyy-MM-dd')?.toLowerCase() ?? '';}
}

export class DateMonthColumnStrategy implements ColumnStrategy {
    constructor(private date: DatePipe) { }
    render(v: any): string {
        const monthIndex = Number(v) - 1;
        const fakeDate = new Date(2000, monthIndex, 1);
        return this.date.transform(fakeDate, 'LLLL')?.toUpperCase() ?? '-';
    }
    searchValue(v: any): string {
    const monthIndex = Number(v) - 1;
    const fakeDate = new Date(2000, monthIndex, 1);
    return this.date.transform(fakeDate, 'LLLL')?.toLowerCase() ?? '-';
    }
}

export class StatusColumnStrategy implements ColumnStrategy {
    constructor(private sanitizer: DomSanitizer) { }
    private readonly statusGroups: Record<string, string[]> = {
        'bg-green-500 text-green-900': ['Pagado', 'Activo', 'Pagado con Transferencia'],
        'bg-red-500 text-red-950': ['No pagado', 'Exmiembro'],
        'bg-yellow-400 text-yellow-900': ['Pago parcial']
    };
    render(value: any): SafeHtml {
        let badgeClass = '-';
        for (const [cssClass, values] of Object.entries(this.statusGroups)) {
            if (values.includes(value)) {
                badgeClass = cssClass;
                break;
            }
        }
        return this.sanitizer.bypassSecurityTrustHtml(
            `<span class="px-2 py-1 text-xs font-bold uppercase rounded ${badgeClass}">
            ${value ?? ''}
            </span>`
        );
    }
    searchValue(value: any): string {return String(value ?? '').toLowerCase();}
}

export class MemberFullNameColumnStrategy implements ColumnStrategy {
    constructor(private sanitizer: DomSanitizer) { }
    render(v: any): SafeHtml {
        if (!v) return '-';
        const { firstName, lastName } = v;
        return this.sanitizer.bypassSecurityTrustHtml(`
        <div class="flex items-center justify-center  relative">
            <img src="imgs/User.svg"
                alt="${firstName} ${lastName}"
                class="rounded-full object-cover w-9 h-9 absolute left-1/2 -translate-x-3/2"/>
            <span class="ml-20 whitespace-nowrap">${firstName} ${lastName}</span>
        </div>
        `);
    }
    searchValue(v: any): string {
    if (!v) return '';
    return `${v.firstName} ${v.lastName}`.toLowerCase();
    }
}

export class MemberStatementColumnStrategy implements ColumnStrategy {
    constructor(private sanitizer: DomSanitizer) { }
    render(v: any): SafeHtml {
        if (!v) return '-';
        const { id } = v;
        return this.sanitizer.bypassSecurityTrustHtml(`
        <div class="flex items-center justify-center">
            <a href="/member/statement/${id}" aria-label="See statement member"
                class="group relative flex items-center justify-center 
                        w-9 h-9 rounded 
                        bg-dark-green/80 shadow-md hover:shadow-lg hover:scale-105 
                        hover:bg-mountain-meadow 
                        transition-all duration-300 ease-in-out">
                <svg class="w-7 h-7 text-caribbean-green group-hover:text-anti-flash-white transition-colors duration-300">
                <use xlink:href="/icons/sprite.svg#Statement" />
                </svg>
            </a>
        </div>
        `);
    }
}

