import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { MonthlyFeeDTO } from '../models/monthly-fee-dto';
import { BaseService } from '../../../../../shared/abstract/base-service';

@Injectable({providedIn: 'root'})
export class MonthlyFeeService extends BaseService<MonthlyFeeDTO>{
  protected baseUrl = environment.apiBaseUrl + '/fees';
  public entityName = 'Monthly Fees';
}
