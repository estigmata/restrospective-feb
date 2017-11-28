import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Retrospective } from '../../shared/retrospective.model';
import { RetrospectiveService } from './../../shared/retrospective.service';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Player } from './../models/player.model';
import { PlayerService } from '../../shared/player.service';
import { Subscription } from 'rxjs/Subscription';
import { ClientSocketService } from '../service-socket/client-socket.service';

@Component({
  selector: 'app-retrospective-navbar',
  templateUrl: './retrospective-navbar.component.html',
  styleUrls: ['./retrospective-navbar.component.css']
})
export class RetrospectiveNavbarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() retrospective: Retrospective;
  players: Player[];
  player: Player;
  subscription: Subscription;

  constructor(private router: ActivatedRoute,
              private retrospectiveService: RetrospectiveService,
              private playerService: PlayerService,
              private clientSocketService: ClientSocketService) { }

  ngOnInit() {
    this.subscription = this.playerService.getPlayer()
    .subscribe((player: Player) => {
      this.player = player;
      const socket = this.clientSocketService.startConnection(player);
    });

    this.retrospectiveService.getRetrospectivesById(this.retrospective._id)
    .switchMap((retrospective: Retrospective) => {
      this.retrospective = retrospective;
      return this.retrospectiveService.getPlayersByRetrospective(this.retrospective._id);
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe((playerList: Player[]) => {
      this.players = playerList.filter(player => player._id !== this.player._id );
      if (this.retrospective.state === 'Votes') {
        this.chargeVotes();
      }
    },
    (error: Error) => {
      console.log(error);
    });

    this.retrospectiveService.updateRetrospectiveNextStep$
      .takeUntil(this.ngUnsubscribe)
      .subscribe((retrospective: Retrospective) => {
        this.retrospective = retrospective;
      });

    this.clientSocketService.listenNewPlayer()
      .takeUntil(this.ngUnsubscribe)
      .subscribe( (player: Player)  => {
        const votes = player.votes.reduce((previousVote, currentVote) => {
          return previousVote + currentVote.numberVotes;
        }, 0);
        if (player._id !== this.player._id) {
          const playerFound = this.players.find(playerSearch => {
            return playerSearch._id === player._id;
          });

          if (playerFound) {
            playerFound.votes = votes;
          } else {
            player.votes = votes;
            this.players.push(player);
          }
        }
      });

    this.clientSocketService.listenRetrospectiveUpdateState()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((retrospective: Retrospective) => {
        this.retrospective = retrospective;
        if (this.retrospective.state === 'Votes') {
          this.chargeVotes();
        }
      });
  }

  chargeVotes(): void {
    this.players.map(currentPlayer => {
      if (currentPlayer.votes instanceof Array) {
        currentPlayer.votes = currentPlayer.votes.reduce((previousVote, currentVote) => {
          return previousVote + currentVote.numberVotes;
        }, 0);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
