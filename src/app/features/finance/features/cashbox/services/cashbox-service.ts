import { environment } from '../../../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CashboxDTO } from '../models/cashbox-dto';
import { NotificationService } from '../../../../../services/notification-service/notification-service';

@Injectable({
  providedIn: 'root'
})
export class CashboxService {
  
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  private baseUrl = environment.apiBaseUrl + '/cashbox';


  getAllCashbox(): Observable<CashboxDTO[]> {
      return this.http.get<CashboxDTO[]>(this.baseUrl).pipe(
        catchError(error => {
          this.notification.error('Error', 'Could not load cashbox');
          return throwError(() => error);
        }
      )
    );
  }

  addCashbox(cashbox: CashboxDTO): Observable<CashboxDTO> {
      return this.http.post<CashboxDTO>(`${this.baseUrl}`, cashbox).pipe(
        catchError(error => {
          this.notification.error('Error', 'Could not add cashbox');
          return throwError(() => error);
        }
      )
    );
  }

  updateCashbox(cashbox: CashboxDTO): Observable<CashboxDTO> {
      return this.http.put<CashboxDTO>(`${this.baseUrl}/${cashbox.id}`, cashbox).pipe(
        catchError(error => {
          this.notification.error('Error', 'Could not update cashbox');
          return throwError(() => error);
        }
      )
    );
  }

  deleteCashbox(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
        catchError(error => {
          this.notification.error('Error', 'Could not delete cashbox');
          return throwError(() => error);
        }
      )
    );
  }
  
}
