import { Directive, Signal, computed, output } from '@angular/core';

@Directive()
export abstract class BaseFormDelete<T extends { id: number }> {
    // ===== Inputs & Outputs =====
    abstract entity: Signal<T | null>;
    readonly close = output<void>();
    readonly delete = output<number>();
    // ===== Computed de Id =====
    readonly entityId = computed(() => this.entity()?.id ?? null);
    // ===== Métodos públicos =====
    onCancel() {
        this.close.emit();
    }

    onConfirm() {
        const id = this.entityId();
        if (id != null) {
            this.delete.emit(id);
            this.close.emit();
        }
    }
}
