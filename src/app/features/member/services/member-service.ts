import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { MemberDTO } from '../models/member-dto';
import { BaseService } from '../../../shared/abstract/base-service';

@Injectable({ providedIn: 'root' })

export class MemberService extends BaseService<MemberDTO> {
  protected baseUrl = environment.apiBaseUrl + '/members';
  public entityName = 'Member';
}
