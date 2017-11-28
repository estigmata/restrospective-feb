import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { environment } from '../../environments/environment';
import { Retrospective } from '../shared/retrospective.model';
import { Subject } from 'rxjs/Subject';
import { Player } from './../retrospective/models/player.model';

@Injectable()
export class RetrospectiveService {
  private updateRetrospective = new Subject<Retrospective>();
  updateRetrospectiveNextStep$ = this.updateRetrospective.asObservable();

  constructor(private http: HttpClient) { }

  getRetrospectivesById(retrospectiveId: string): Observable<Retrospective> {
    return this.http.get<Retrospective>(`${environment.backendPath}retrospectives/${retrospectiveId}`).map(
      (retrospective: Retrospective) => {
        return retrospective;
      }
    );
  }

  getPlayersByRetrospective(retrospectiveId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${environment.backendPath}retrospectives/${retrospectiveId}/players`)
    .map( (wrapper: Player[]) => {
      return wrapper;
    });
  }

  updateRetrospectiveById(retrospectiveId: string, token: string, field): Observable<Retrospective> {
    return this.http.put<Retrospective>(`${environment.backendPath}retrospectives/${retrospectiveId}`,
    field, { headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})})
    .map((updatedRetrospective: Retrospective) => {
      return updatedRetrospective;
    });
  }

  updateRetrospectiveNextStep(retrospective: Retrospective) {
    return this.updateRetrospective.next(retrospective);
  }

  getRetrospectives(): Observable<Retrospective[]> {
    return this.http.get(`${environment.backendPath}retrospectives`)
      .map( (wrapper: Retrospective[]) => {
        return wrapper;
      });
  }

  createRetrospective(userToken: string, newRetrospective: Retrospective): Observable<Retrospective> {
    return this.http.post<Retrospective>(`${environment.backendPath}retrospectives`, newRetrospective,
      { headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': userToken })})
      .map (( retrospective: Retrospective ) => {
            console.log("retro creada: ", retrospective);
            return retrospective;
          }
        );
  }
}
