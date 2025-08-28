import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification-service/notification-service';
export abstract class BaseService<T extends { id: number }> {
    protected readonly http = inject(HttpClient);
    protected readonly notification = inject(NotificationService);

    protected abstract baseUrl: string;
    public abstract entityName: string;

    getAll(): Observable<T[]> {
        return this.http.get<T[]>(this.baseUrl).pipe(
            catchError(error => {
                this.notification.error('Error', `Could not load ${this.entityName}`);
                return throwError(() => error);
            })
        );
    }

    add(entity: T): Observable<T> {
        return this.http.post<T>(this.baseUrl, entity).pipe(
            catchError(error => {
                this.notification.error('Error', `Could not add ${this.entityName}`);
                return throwError(() => error);
            })
        );
    }

    update(entity: T): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${entity.id}`, entity).pipe(
            catchError(error => {
                this.notification.error('Error', `Could not update ${this.entityName}`);
                return throwError(() => error);
            })
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            catchError(error => {
                this.notification.error('Error', `Could not delete ${this.entityName}`);
                return throwError(() => error);
            })
        );
    }
}
