import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { CashboxDTO } from '../models/cashbox-dto';
import { BaseService } from '../../../../../shared/abstract/base-service';

@Injectable({providedIn: 'root'})
export class CashboxService extends BaseService<CashboxDTO> {
  protected baseUrl = environment.apiBaseUrl + '/cashbox';
  public entityName = 'Cashbox';
}
