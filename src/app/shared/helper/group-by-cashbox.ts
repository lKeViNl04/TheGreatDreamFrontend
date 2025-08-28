import type { Box } from "../../features/finance/components/accordion-table/box";

export function groupByCashbox<T extends { cashBoxId: number }>
(data: T[], makeStrategy: () => any): Box[]{
    const groups: Record<number, T[]> = {};

    data.forEach(item => {
        if (!groups[item.cashBoxId]) groups[item.cashBoxId] = [];
        groups[item.cashBoxId].push(item);
    });

    return Object.entries(groups).map(([cashboxId, items]) => ({
        id: Number(cashboxId),
        name: `Caja ${cashboxId}`,
        strategy: makeStrategy(),
        items
    }));
}
