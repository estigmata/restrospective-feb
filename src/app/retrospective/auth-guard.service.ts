import { Injectable } from '@angular/core';
import { Router, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PlayerService } from '../shared/player.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Player } from './models/player.model';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';

@Injectable()
export class AuthGuard implements CanActivateChild {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private playerService: PlayerService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {

  return this.playerService.getPlayer()
    .map((player: Player) => {
      if (player === null || player.retrospectiveId !== route.parent.params['id']) {
        this.userService.getUser()
        .subscribe((user: User) => {
          if (user) {
            this.playerService.getPlayerFromUser(user._id, route.parent.params['id'])
            .subscribe((playerFound: Player) => {
              if (playerFound) {
                this.playerService.setPlayerInSessionStorage(playerFound);
                return true;
              } else {
                this.router.navigate([`/retrospective/${route.parent.params['id']}/login`]);
                return false;
              }
            });
          } else {
            this.router.navigate([`/retrospective/${route.parent.params['id']}/login`]);
            return false;
          }
        });
      } else {
        return true;
      }
    });
  }
}
