import { environment } from '../../../../../../environments/environment';
import { NotificationService } from '../../../../../services/notification-service/notification-service';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MonthlyFeeDTO } from '../models/monthly-fee-dto';

@Injectable({providedIn: 'root'})

export class MonthlyFeeService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  private readonly baseUrl = environment.apiBaseUrl + '/fees';

  public getAllMonthlyFee(): Observable<MonthlyFeeDTO[]> {
    return this.http.get<MonthlyFeeDTO[]>(this.baseUrl).pipe(
      catchError((error) => {
        this.notification.error('Error', 'Could not load Monthly Fees');
        return throwError(() => error);
      })
    );
  }

  addMonthlyFee(monthlyFee: MonthlyFeeDTO): Observable<MonthlyFeeDTO> {
    return this.http.post<MonthlyFeeDTO>(`${this.baseUrl}`, monthlyFee).pipe(
      catchError((error) => {
        this.notification.error('Error', 'Could not add Monthly Fee');
        return throwError(() => error);
      })
    );
  }

  updateMonthlyFee(monthlyFee: MonthlyFeeDTO): Observable<MonthlyFeeDTO> {
    return this.http.put<MonthlyFeeDTO>(`${this.baseUrl}/${monthlyFee.id}`, monthlyFee).pipe(
      catchError((error) => {
        this.notification.error('Error', 'Could not update Monthly Fee');
        return throwError(() => error);
      })
    );
  }

  deleteMonthlyFee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        this.notification.error('Error', 'Could not delete Monthly Fee');
        return throwError(() => error);
      })
    );
  }
}
