import { Directive, input, output, Signal, signal, effect, inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service/notification-service';

@Directive()
export abstract class BaseFormEdit<T> {
    // ===== Inputs / Outputs =====
    readonly entity = input<T | null>(null);
    readonly editEntity = signal<T | null>(null);

    readonly close = output<void>();
    readonly edit = output<T>();

    
    protected readonly notification = inject(NotificationService);

    constructor() {
        // Sincronizar la entidad editable con el input
        effect(() => {
            const e = this.entity();
            this.editEntity.set(e ? structuredClone(e) : null);
        });
    }

    // ===== Computed abstractos =====
    abstract formValid: Signal<boolean>;

    // ===== Métodos abstractos que dependen del tipo de entidad =====
    protected abstract isSame(): boolean;
    abstract invalidFields(): string[];

    // ===== Métodos públicos =====
    submitForm(): void {
        if (!this.formValid()) {
            this.notification.warn(
                'Warn',
                'Please fill in all required fields correctly: ' + this.invalidFields().join(', ')
            );
            return;
        }

        if (this.isSame()) {
            this.notification.warn('Warn', 'Please edit the entity before saving.');
            return;
        }

        const e = this.editEntity();
        if (e) {
            this.edit.emit(e);
            this.close.emit();
        }
    }

    patchEntityEdit(patch: Partial<T>): void {
        this.editEntity.update(e => (e ? { ...e, ...patch } : e));
    }

    onCancel(): void {
        this.close.emit();
    }
}
