import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { environment } from '../../environments/environment';
import { Retrospective } from '../shared/retrospective.model';

@Injectable()
export class TeamService {

  constructor(private http: HttpClient) { }

  createRetrospective(newRetrospective: Retrospective): Observable<Retrospective> {
    return this.http.post<Retrospective>(`${environment.backendPath}retrospectives`, newRetrospective, { headers: new HttpHeaders()
      .set ('Content-Type', 'application/json') }).map (
        ( retrospective: Retrospective ) => {
          return retrospective;
        }
    );
  }
}
