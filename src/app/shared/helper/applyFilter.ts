import { TableColumn } from "../components/generic-table/table";

export function applyFilter<T extends Record<string, any>>(term: string, items: T[], columns: TableColumn[]): T[] {
    const trimmedTerm = term.trim().toLowerCase();
    if (!trimmedTerm) return items;

    if (!trimmedTerm.includes(':')) {
        return items.filter(item =>
            columns.some(col => {
                const value = col.valueGetter ? col.valueGetter(item) : item[col.key as keyof T];
                const searchFn = col.strategy.searchValue?.bind(col.strategy);
                const searchString = searchFn
                    ? searchFn(value)
                    : String(value ?? '').toLowerCase();
                return searchString.includes(trimmedTerm);
            })
        );
    }

    const [rawKey, rawValue] = trimmedTerm.split(':').map(t => t.trim());
    const exactMatch = rawValue.endsWith('-');
    const value = exactMatch ? rawValue.slice(0, -1) : rawValue;

    const col = columns.find(c => c.key.toLowerCase() === rawKey);
    if (!col) return items;

    return items.filter(item => {
        const fieldValue = col.valueGetter ? col.valueGetter(item) : item[col.key as keyof T];
        if (fieldValue == null) return false;
        const searchFn = col.strategy.searchValue?.bind(col.strategy);
        const searchString = searchFn
            ? searchFn(fieldValue)
            : String(fieldValue ?? '').toLowerCase();
        return exactMatch
            ? searchString === value
            : searchString.includes(value);
    });
}
