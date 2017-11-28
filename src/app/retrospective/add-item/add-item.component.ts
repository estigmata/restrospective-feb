import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Category } from '../../shared/category.model';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { Retrospective } from '../../shared/retrospective.model';
import { Item } from '../models/item.model';
import { ItemService } from '../item.service';
import { Player, PlayerColor } from './../models/player.model';
import { PlayerService } from '../../shared/player.service';
import { UserService } from '../../shared/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../shared/user.model';
import { ClientSocketService } from './../service-socket/client-socket.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})

export class AddItemComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public retrospective: Retrospective;
  public categories = [];
  public categoriesMap = {};
  configuration = {
    isAddActive: true,
    isVoteActive: false,
    isDropActive: false,
  };

  isNextButtonActive = false;
  player: Player;
  user: User;
  isModerator = false;

  constructor(
    private retrospectiveService: RetrospectiveService,
    private itemService: ItemService,
    private playerService: PlayerService,
    private router: ActivatedRoute,
    private route: Router,
    private userService: UserService,
    private clientSocketService: ClientSocketService) { }
    private token: string;
  ngOnInit() {
    this.router.data
    .switchMap(({ resolverData: data }) => {
      this.retrospective = data.retrospective;
      this.retrospective.categories.forEach(category => {
        const selectedItems = data.items.filter(item => item.categoryId === category._id).reverse();
        const newCategory = new Category(category.name, category.color, selectedItems, category._id);
        this.isNextButtonActive  = data.items.length > 0;
        this.categoriesMap[newCategory._id] = newCategory;
        this.categories.push(newCategory);
      });
      return this.userService.getUser();
    })
    .switchMap((user: User | null) => {
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
      this.clientSocketService.startConnection(player);
    },
    (error: Error) => {
      console.log(error);
    });

    this.clientSocketService.listenItemDelete()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: Item) => {
        const category = this.categoriesMap[item.categoryId];
        category.items = category.items.filter(itemFound => {
          return item._id !== itemFound._id;
        });
        this.isNextButtonActive = this.categories.some( categoryItem => categoryItem.items.length > 0);
      });

  this.clientSocketService.listenItemUpdate()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      const category = this.categoriesMap[item.categoryId];
      const itemFound = this.getItemFromCategory(category, item);
      itemFound.summary = item.summary;
      itemFound.status = false;
    });

  this.clientSocketService.listenItemEditionStart()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      const category = this.categoriesMap[item.categoryId];
      this.getItemFromCategory(category, item).status = true;
    });

  this.clientSocketService.listenItemCreationCanceled()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      const category = this.categoriesMap[item.categoryId];
      if (item.summary === 'Typing') {
        this.removeItemOnEditMode(item, category);
      } else {
        const itemFound = this.getItemFromCategory(category, item);
        itemFound.summary = item.summary;
        itemFound.status = false;
      }
    });

  this.clientSocketService.listenItemCreation()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      const category = this.categoriesMap[item.categoryId];
      const itemFound = category.items.find(itemSearch => {
        return itemSearch.summary === '';
      });
      item.summary = 'Typing';
      if (itemFound) {
        const itemCreated = category.items.shift();
        category.items.unshift(item);
        category.items.unshift(itemCreated);
      } else {
        category.items.unshift(item);
      }
    });

  this.clientSocketService.listenItemSaved()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      const category = this.categoriesMap[item.categoryId];
      const itemFound = category.items.find(itemSearch => {
        return itemSearch.summary === '';
      });
      if (itemFound) {
        const itemCreated = category.items.shift();
        this.orderItemsInRealTime(item, category);
        category.items.unshift(itemCreated);
      } else {
        this.orderItemsInRealTime(item, category);
      }
    });

  this.clientSocketService.listenRetrospectiveUpdateState()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((retrospective: Retrospective) => {
      this.route.navigate([`retrospective/${retrospective._id}/${retrospective.state.toLowerCase()}`]);
    });
  }

  goToNextStage() {
    this.retrospectiveService.updateRetrospectiveById(this.retrospective._id, this.token, { state: 'Grouping' })
      .subscribe(
        (data: Retrospective) => {
          this.route.navigate([`retrospective/${this.retrospective._id}/grouping`]);
        },
        (error: Error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveItem(newItem) {
    newItem.retrospectiveId = this.retrospective._id;
    this.itemService.create(this.token, newItem).subscribe(
      (itemCreated: Item) => {
        newItem._id = itemCreated._id;
        newItem.editMode = false;
        newItem.playerId = new PlayerColor(this.player._id, this.player.color );
        this.orderItems(newItem);
      },
      (error: Error) => {
        console.log('error', error);
      }
    );
  }

  saveEditItem(objectItem) {
    if (objectItem.item.summary === '') {
      const category = this.categoriesMap[objectItem.item.categoryId];
      const index = category.items.indexOf(objectItem.item);
      category.items.splice(index, 1);
      objectItem.item.summary = 'Typing';
      this.clientSocketService.sendCancelCreateEditItem(objectItem.item);
      return;
    }

    delete(objectItem.item.editMode);
    delete(objectItem.item.status);
    if (objectItem.item._id) {
      if (!objectItem.edited) {
        this.updateItem(objectItem.item);
      } else {
        this.clientSocketService.sendCancelCreateEditItem(objectItem.item);
      }
    } else {
      this.saveItem(objectItem.item);
    }
  }

  updateItem(newItem) {
    this.itemService.updateField(newItem._id, {summary: newItem.summary}, this.token).subscribe(
      (itemCreated: Item) => {
        newItem.editMode = false;
      },
      (error: Error) => {
        console.log('error', error);
      }
    );
  }
  deleteItem(itemToDelete: Item): void {
    if (itemToDelete._id) {
      this.itemService.delete(itemToDelete, this.token).subscribe(
        (deletedItem) => {

        },
        (error: Error) => {
          console.log('error');
        }
      );
    }
  }

  createdItem(event) {
    this.clientSocketService.sendCreateItem(event);
  }

  orderItemsInRealTime(item, category) {
    this.removeItemOnEditMode(item, category);
    const itemFound = this.getItemFromCategory(category, item);
    if (!itemFound) {
      category.items.unshift(item);
      this.isNextButtonActive = true;
    }
  }

  removeItemOnEditMode(item, category) {
    const itemFound = category.items.find(itemSearch => {
      return itemSearch.summary === 'Typing' && item.playerId._id !== this.player._id;
    });
    if (itemFound) {
      const index = category.items.indexOf(itemFound);
      category.items.splice(index, 1);
    }
  }

  startEdit(event) {
    this.clientSocketService.sendEditionStartItem(event);
  }

  orderItems(item) {
    const category = this.categoriesMap[item.categoryId];
    const itemFound = this.getItemFromCategory(category, item);

    if (itemFound) {
      const index = category.items.indexOf(itemFound);
      category.items.splice(index, 1);
    }
  }

  getItemFromCategory(category, item) {
    return category.items.find(itemSearch => {
      return itemSearch._id === item._id;
    });
  }
}
