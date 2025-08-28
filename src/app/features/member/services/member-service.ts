import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MemberDTO } from '../models/member-dto';
import { NotificationService } from '../../../services/notification-service/notification-service';

@Injectable({ providedIn: 'root' })

export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);

  private baseUrl = environment.apiBaseUrl + '/members';

  getAllMembers(): Observable<MemberDTO[]> {
    return this.http.get<MemberDTO[]>(this.baseUrl).pipe(
      catchError(error => {
        this.notification.error('Error', 'Could not load members');
        return throwError(() => error);
      })
    );
  }

  addMember(member: MemberDTO): Observable<MemberDTO> {
    return this.http.post<MemberDTO>(`${this.baseUrl}`, member).pipe(
      catchError(error => {
        this.notification.error('Error', 'Could not add member');
        return throwError(() => error);
      })
    );
  }

  updateMember(member: MemberDTO): Observable<MemberDTO> {
    return this.http.put<MemberDTO>(`${this.baseUrl}/${member.id}`, member).pipe(
      catchError(error => {
        this.notification.error('Error', 'Could not update member');
        return throwError(() => error);
      })
    );
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        this.notification.error('Error', 'Could not delete member');
        return throwError(() => error);
      })
    );
  }

}
