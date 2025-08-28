import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { MonthlyExpenseDTO } from '../models/monthly-expense-dto';
import { BaseService } from '../../../../../shared/abstract/base-service';

@Injectable({providedIn: 'root'})

export class MonthlyExpenseService extends BaseService<MonthlyExpenseDTO> {
  protected baseUrl = environment.apiBaseUrl + '/expenses';
  public entityName = 'Monthly Expenses';
}
