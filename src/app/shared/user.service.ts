import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user.model';
import { environment } from '../../environments/environment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class UserService {
  public userAnnounced = new ReplaySubject<User>();
  userAnnounced$ = this.userAnnounced.asObservable();

  constructor(private http: HttpClient) {
    this.getUser().subscribe((user: User | null) => {
      if (user) {
        this.userAnnounced.next(user);
      } else {
        this.userAnnounced.next(new User('', '', '', ''));
      }
    });
  }

  getUser(): Observable<User> {
    return Observable.of(JSON.parse(localStorage.getItem('user')));
  }
  getUserToken(): string {
    return localStorage.getItem('token');
  }

  decodeToken(token) {
    let payload = token.split('.')[1];
    return window.atob(payload);
  }

  createUser(user: User): Observable<Object> {
    return this.http.post<Object>(`${environment.backendPath}users`, user,
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) })
      .map (( token: Object ) => {
            return token;
          }
        );
  }

  authenticateUser(user: User): Observable<Object> {
    return this.http.post<Object>(`${environment.backendPath}users/authenticate`, user,
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) })
      .map (( token: Object ) => {
            return token;
          }
        );
  }

  getUserAuthenticate(userId): Observable<User> {
    return this.http.get<User>(`${environment.backendPath}users/${userId}`,
    { headers: new HttpHeaders({'Content-Type': 'application/json'})})
    .map((user: User) => {
      this.setUserInLocalStorage(user);
      return user;
    });
  }

  setUserInLocalStorage(user: User): void {
    this.userAnnounced.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  decodeTokenUser(token) {
    let payload = token.split('.')[1];
    return JSON.parse(window.atob(payload));
  }

  replayUser() {
    return this.userAnnounced$;
  }
  
}
