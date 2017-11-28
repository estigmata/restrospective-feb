import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemService } from '../item.service';
import { Subject } from 'rxjs/Subject';
import { Item } from './../models/item.model';
import { Category } from './../../shared/category.model';
import { Retrospective } from './../../shared/retrospective.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from './../models/player.model';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { PlayerService } from '../../shared/player.service';
import { Subscription } from 'rxjs/Subscription';
import { ClientSocketService } from './../service-socket/client-socket.service';
import { User } from '../../shared/user.model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css']
})

export class ActionItemsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  retrospective: Retrospective;
  items: Item[];
  itemSelected: Item;
  category: Category;
  index = 0;
  next = true;
  back = true;
  player: Player;
  user: User;
  isModerator = false;

  constructor(
    private itemService: ItemService,
    private playerService: PlayerService,
    private router: ActivatedRoute,
    private route: Router,
    private retrospectiveService: RetrospectiveService,
    private clientSocketService: ClientSocketService,
    private userService: UserService) {}
    private token: string;

  ngOnInit() {
    this.router.data
    .switchMap(({ resolverData: data }) => {
      this.retrospective = data.retrospective;
      this.retrospectiveService.updateRetrospectiveNextStep(this.retrospective);
      this.itemService.setCategoryInfoOnChildrenItems(data.items, this.retrospective.categories);
      this.items = data.items.filter((item) => {
        return item.votes > 0;
      })
      .sort((item, nextItem) => {
        return nextItem.votes - item.votes;
      });

      this.itemSelected = this.items[this.index];
      this.category = this.itemService.getItemCategory(this.retrospective.categories, this.itemSelected);
      this.next = (this.items.length <= 1) ? true : false;
      return this.userService.getUser();
    })
    .switchMap((user: User) => {
      if (user) {
        this.user = user;
        this.token = this.userService.getUserToken();
      } else {
        this.token = this.playerService.getPlayerToken();
      }
      return this.playerService.getPlayer();
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe((player: Player) => {
      this.player = player;
      this.isModerator = this.player.role === 'Moderator';
    },
    (error: Error) => {
      console.log(error);
    });

    this.clientSocketService.listenRetrospectiveUpdateState()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((retrospective: Retrospective) => {
        this.route.navigate([`retrospective/${retrospective._id}/reports`]);
      });

    this.clientSocketService.listenItemUpdate()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: Item) => {
        this.findItemAction(item);
      });
  }

  changePosition(position) {
    this.index += position;
    if ( this.index <= 0 ) {
      this.back = true;
      this.next = false;
    } else if (this.index >= this.items.length - 1) {
      this.next = true;
      this.back = false;
    } else {
      this.back = false;
      this.next = false;
    }
    this.itemSelected = this.items[this.index];
    this.category = this.itemService.getItemCategory(this.retrospective.categories, this.itemSelected);
  }

  setActionItem(actionItem) {
    this.itemService.updateField(this.itemSelected._id, {actionItem}, this.token).subscribe(updatedItem => {
        this.itemSelected.actionItem = updatedItem.actionItem;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  goToNextStage() {
    this.retrospectiveService.updateRetrospectiveById(this.retrospective._id, this.token, { state: 'Done' })
    .subscribe(
      (data: Retrospective) => {
        this.route.navigate([`retrospective/${this.retrospective._id}/reports`]);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  findItemAction(item) {
    if (item._id === this.items[this.index]._id) {
      this.itemSelected.actionItem = item.actionItem;
      return;
    }
    this.items.find(value => {
      return value._id === item._id;
    }).actionItem = item.actionItem;
  }
}
