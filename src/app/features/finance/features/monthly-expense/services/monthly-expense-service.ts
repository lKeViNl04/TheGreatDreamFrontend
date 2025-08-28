import { environment } from '../../../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MonthlyExpenseDTO } from '../models/monthly-expense-dto';
import { NotificationService } from '../../../../../services/notification-service/notification-service';

@Injectable({providedIn: 'root'})

export class MonthlyExpenseService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  private baseUrl = environment.apiBaseUrl + '/expenses';

  getAllMonthlyExpense(): Observable<MonthlyExpenseDTO[]> {
        return this.http.get<MonthlyExpenseDTO[]>(this.baseUrl).pipe(
          catchError((error) => {
            this.notification.error('Error', 'Could not load Monthly Expenses');
            return throwError(() => error);
          }
        )
      );
    }
  
  addMonthlyExpense(monthlyExpense:MonthlyExpenseDTO): Observable<MonthlyExpenseDTO>{
      return this.http.post<MonthlyExpenseDTO>(`${this.baseUrl}`, monthlyExpense).pipe(
        catchError((error) => {
          this.notification.error('Error', 'Could not add Monthly Expense');
          return throwError(() => error);
        }
      )
    );
  }
  
  updateMonthlyExpense(monthlyExpense:MonthlyExpenseDTO): Observable<MonthlyExpenseDTO>{
      return this.http.put<MonthlyExpenseDTO>(`${this.baseUrl}/${monthlyExpense.id}`, monthlyExpense).pipe(
        catchError((error) => {
          this.notification.error('Error', 'Could not update Monthly Expense');
          return throwError(() => error);
        }
      )
    )
  }

  deleteMonthlyExpense(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
        catchError((error) => {
          this.notification.error('Error', 'Could not delete Monthly Expense');
          return throwError(() => error);
        }
      )
    );
  }
}
