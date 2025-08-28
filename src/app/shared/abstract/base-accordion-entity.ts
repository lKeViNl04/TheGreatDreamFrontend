import { computed } from "@angular/core";
import { BaseEntity } from "./base-entity";
import type { TableColumn } from "../components/generic-table/table";
import type { Box } from "../../features/finance/components/accordion-table/box";
import { groupByCashbox } from "../helper/group-by-cashbox";

export abstract class BaseAccordionEntity<T extends { id: number; cashBoxId: number }> extends BaseEntity<T> {
    abstract override tableColumns: TableColumn[];
    protected abstract makeStrategy(): any;
    // ===== Estados comunes =====
    readonly accordionData = computed(() => 
    groupByCashbox(this.entity(), () => this.makeStrategy())
    );

    readonly filteredAccordionData = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        return this.accordionData().filter(box =>
            box.name.toLowerCase().includes(term)
        );
    });

    override readonly totalPages = computed(() =>
        Math.max(1, Math.ceil(this.filteredAccordionData().length / this.pageSize()))
    );
}
