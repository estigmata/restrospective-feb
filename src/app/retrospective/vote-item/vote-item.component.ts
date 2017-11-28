import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Category } from '../../shared/category.model';
import { Item } from '../models/item.model';
import { ItemService } from '../item.service';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { Retrospective } from '../../shared/retrospective.model';
import { AuthModalComponent } from './../auth-modal/auth-modal.component';
import { Player } from './../models/player.model';
import { PlayerService } from '../../shared/player.service';
import { Subscription } from 'rxjs/Subscription';
import { ClientSocketService } from './../service-socket/client-socket.service';
import { User } from '../../shared/user.model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-vote-item',
  templateUrl: './vote-item.component.html',
  styleUrls: ['./vote-item.component.css'],
  providers: []
})

export class VoteItemComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  retrospective: Retrospective;
  totalVotes;
  totalVotesItems;
  public categories = [];
  configuration = {
    isAddActive: false,
    isVoteActive: true,
    isDropActive: false
  };
  player: Player;
  isNextButtonActive = false;
  user: User;
  isModerator = false;
  constructor(private retrospectiveService: RetrospectiveService,
    private itemService: ItemService,
    private playerService: PlayerService,
    private router: ActivatedRoute,
    private route: Router,
    private clientSocketService: ClientSocketService,
    private userService: UserService) {}
    private token: string;
  ngOnInit() {
    this.playerService.getPlayer()
    .switchMap((player: Player) => {
      this.player = player;
      this.totalVotes = player.maxVotes;
      this.player.votes.forEach(vote => {
        this.totalVotes -= vote.numberVotes;
      });
      this.isModerator = this.player.role === 'Moderator';
      this.isNextButtonActive = (this.totalVotes === 0);
      return this.router.data;
    })
    .switchMap(({ resolverData: data }) => {
     this.retrospective = data.retrospective;
     this.retrospectiveService.updateRetrospectiveNextStep(this.retrospective);
     this.itemService.setCategoryInfoOnChildrenItems(data.items, this.retrospective.categories);
     data.items.forEach(item => {
       this.player.votes.forEach(vote => {
         if (vote.itemId === item._id) {
            item.currentVotes = vote.numberVotes;
         }
       });
      });
      this.retrospective.categories.forEach(category => {
        const selectedItems = data.items.filter(item => item.categoryId === category._id).reverse();
        const newCategory = new Category(category.name, category.color, selectedItems, category._id);
        this.categories.push(newCategory);
      });
      return this.userService.getUser();
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe((user: User) => {
       if (user) {
        this.user = user;
        this.token = this.userService.getUserToken();
      } else {
        this.token = this.playerService.getPlayerToken();
      }
    },
    (error) => {
      console.log('error: ', error);
    });

    this.clientSocketService.listenRetrospectiveUpdateState()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((retrospective: Retrospective) => {
        this.route.navigate([`retrospective/${retrospective._id}/${retrospective.state.toLowerCase()}`]);
      });
  }

  updateVote(event) {
    return this.itemService.updateVotes(event.item._id, event.quantity, this.player._id, this.token)
      .subscribe(player => {
        this.player = player;
        this.totalVotes -= event.quantity;
        this.isNextButtonActive = (this.totalVotes === 0);
        if (event.item.currentVotes !== undefined) {
          event.item.currentVotes += event.quantity;
        } else {
          event.item.currentVotes = 0;
          event.item.currentVotes += event.quantity;
        }
      },
      (error: Error) => {
        console.log('error', error);
      }
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToNextStage() {
    this.retrospectiveService.updateRetrospectiveById(this.retrospective._id, this.token, { state: 'Actions' })
      .subscribe(
        (data: Retrospective) => {
          this.route.navigate([`retrospective/${this.retrospective._id}/actions`]);
        },
        (error: Error) => {
          console.log(error);
        }
      );
  }
}
