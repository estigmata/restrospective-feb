import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Player, PlayerToken } from '../retrospective/models/player.model';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class PlayerService {
  public playerAnnounced = new ReplaySubject<Player>();
  playerAnnounced$ = this.playerAnnounced.asObservable();
  player: Player;

  constructor(private http: HttpClient) {
    this.getPlayer().subscribe((player: Player | null) => {
      if (player) {
        this.playerAnnounced.next(player);
      } else {
        this.playerAnnounced.next(new Player('', '', ''));
      }
    });
  }

  getPlayer(): Observable<Player> {
    return Observable.of(JSON.parse(sessionStorage.getItem('player')));
  }

  getPlayerToken(): string {
    return sessionStorage.getItem('token');
  }

  getPlayerFromUser(userId, retrospectiveId): Observable<Player> {
    return this.http.get(`${environment.backendPath}users/${userId}/retrospectives/${retrospectiveId}/players`)
      .map((player: Player | undefined) => {
        if (player) {
          sessionStorage.setItem('player', JSON.stringify(player));
        }
        return player;
      });
  }

  replayPlayer() {
    return this.playerAnnounced$;
  }

  setPlayer(newPlayer, retrospectiveId): Observable<string> {
    return this.http.post(`${environment.backendPath}retrospectives/${retrospectiveId}/players`,
    newPlayer, {headers: new HttpHeaders().set('Content-Type', 'application/json')})
      .map((playerToken: PlayerToken) => {
        console.log("player que llega: ", playerToken);
        this.setPlayerTokenInSessionStorage(playerToken.playerToken);
        return playerToken.playerToken;
      });
  }

  requestPlayer(playerToken): Observable<Player> {
    let payload = this.decodeToken(playerToken);
    console.log("token decoded: ", payload);

    return this.http.get(`${environment.backendPath}players/${ JSON.parse(payload).playerId}`)
    .map((player: Player | undefined) => {
      this.setPlayerInSessionStorage(player);
      this.player = player;
      console.log("obteniendo el player: ", this.player);
      return this.player;
    });    
  }

  setPlayerInSessionStorage(player: Player): void {
    this.playerAnnounced.next(player);
    sessionStorage.setItem('player', JSON.stringify(player));
  }

  setPlayerTokenInSessionStorage(token: string): void {
    sessionStorage.setItem('token', 'bearer ' + token);
  }

  decodeToken(token) {
    let payload = token.split('.')[1];
    return window.atob(payload);
  }
}
