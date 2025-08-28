import { Directive, inject, output, Signal, signal } from '@angular/core';
import { NotificationService } from '../../services/notification-service/notification-service';

@Directive()
export abstract class BaseFormAdd<T> {
    readonly close = output<void>();
    readonly save = output<T>();
    readonly entity = signal<Partial<T>>({});
    protected readonly notification = inject(NotificationService);
    //===== Constructor =====
    constructor() {}
    /** Retornar si el formulario es válido */
    abstract formValid: Signal<boolean>;
    /** Armar el payload final */
    abstract buildPayload(entity: Partial<T>): T;
    /** Lista de validaciones fallidas (para mostrar en warn) */
    abstract invalidFields(): string[];

    submitForm(): void {
        if (this.formValid()) {
            const payload = this.buildPayload(this.entity());
            this.save.emit(payload);
            this.close.emit();
        } else {
            this.notification.warn(
                'Warn',
                'Please fill in all required fields correctly: ' +
                this.invalidFields().join(', ')
            );
            console.warn('Formulario inválido', this.invalidFields());
        }
    }

    patchEntityAdd(patch: Partial<T>) {
        this.entity.update(e => ({ ...e, ...patch }));
    }

    onCancel(): void {
        this.close.emit();
    }
}
