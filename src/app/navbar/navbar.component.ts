import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Player } from '../retrospective/models/player.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PlayerService } from '../shared/player.service';
import { UserService } from '../shared/user.service';
import { User} from '../shared/user.model';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  player: Player;
  user: User;
  subscription: Subscription;
  isSidebarVisible = false;
  constructor(private translate: TranslateService,
    private playerService: PlayerService,
    private userService: UserService) {
    }

  ngOnInit() {
    this.userService.replayUser()
      .subscribe((user: User) => {
      this.user = user;
    });

    this.subscription = this.playerService.replayPlayer()
    .subscribe((player: Player) => {
      this.player = player;
    },
    (error: Error) => {
      console.log(error);
    });
  }

  switchLanguage (language: string) {
    this.translate.use(language);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openNav() {
    console.log("abrir nav");
    this.isSidebarVisible = true;
  }
  closeNav() {
    console.log("cerrar nav");
    this.isSidebarVisible = false;
  }
}
