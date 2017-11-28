import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Category } from '../../shared/category.model';
import { Subject } from 'rxjs/Subject';
import { Item } from '../models/item.model';
import { ItemService } from '../item.service';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { Retrospective } from '../../shared/retrospective.model';
import { Player } from './../models/player.model';
import { PlayerService } from '../../shared/player.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { ClientSocketService } from './../service-socket/client-socket.service';
import { UserService } from '../../shared/user.service';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css']
})
export class GroupItemComponent implements OnInit, OnDestroy {
  configuration = {
    isAddActive: false,
    isVoteActive: false,
    isDropActive: true,
  };
  categories: Array<Category> = [];
  public categoriesMap = {};
  retrospective: Retrospective;
  ngUnsubscribe: Subject<void> = new Subject<void>();
  player: Player;
  user: User;
  isModerator = false;
  private token: string;

  constructor(private retrospectiveService: RetrospectiveService,
    private itemService: ItemService,
    private router: ActivatedRoute,
    private route: Router,
    private playerService: PlayerService,
    private translateService: TranslateService,
    private userService: UserService,
    private clientSocketService: ClientSocketService) { }

  ngOnInit() {
    this.router.data
    .switchMap(({ resolverData: data }) => {
      this.retrospective = data.retrospective;
      this.retrospectiveService.updateRetrospectiveNextStep(this.retrospective);
      this.itemService.setCategoryInfoOnChildrenItems(data.items, this.retrospective.categories);
      this.retrospective.categories.forEach(category => {
        const selectedItems = data.items.filter(item => item.categoryId === category._id).reverse();
        const newCategory = new Category(category.name, category.color, selectedItems, category._id);
        this.categoriesMap[newCategory._id] = newCategory;
        this.categories.push(newCategory);
      });
      return  this.userService.getUser();
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
      const socket = this.clientSocketService.startConnection(player);
    },
    (error: Error) => {
      console.log(error);
    });

    this.clientSocketService.listenRetrospectiveUpdateState()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((retrospective: Retrospective) => {
        this.route.navigate([`retrospective/${retrospective._id}/${retrospective.state.toLowerCase()}`]);
      });

    this.clientSocketService.listenItemUpdate()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      if (item.actionItem === '' && item.parent === true) {
        this.categoriesMap[item.categoryId].items.push(item);
      }
      if (item.children.length > 1) {
        item.children.forEach(child => {
          this.itemService.setcategoryInfoOnChildItem(item, child, this.categories);
          this.removeItemFromCategory(child);
        });
        const category = this.categoriesMap[item.categoryId];
        const itemFound = category.items.find((itemSearch: Item ) => {
          return itemSearch._id === item._id;
        });
        itemFound.children = item.children;
      }
      const category = this.categoriesMap[item.categoryId];
      const itemFound = this.getItemFromCategory(category, item);
      if (itemFound) {
        itemFound.summary = item.summary;
        itemFound.status = false;
      }
    });

    this.clientSocketService.listenItemSaved()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      item.children.forEach(child => {
        this.itemService.setcategoryInfoOnChildItem(item, child, this.categories);
        this.removeItemFromCategory(child);
      });
      this.addItemInACategory(item);
    });

    this.clientSocketService.listenItemDelete()
    .takeUntil(this.ngUnsubscribe)
    .subscribe((item: Item) => {
      this.removeItemFromCategory(item);
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToNextStage() {
    this.retrospectiveService.updateRetrospectiveById(this.retrospective._id, this.token, { state: 'Votes' })
      .subscribe(
        (data: Retrospective) => {
          this.route.navigate([`retrospective/${this.retrospective._id}/votes`]);
        },
        (error: Error) => {
          console.log(error);
        }
      );
  }

  groupItems(items): void {
    if (items.child.children.length === 0 && items.parent._id !== items.child._id) {
      if (items.parent.children.length > 0) {
        items.parent.children.push(items.child);
        this.itemService.setChild(items.parent._id, items.child._id, this.token)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(groupItems => {
        },
        (error: Error) => {
          console.log('error', error);
        });
      } else {
        const children = [items.parent, items.child];
        const newGroup: Item = new Item(this.player._id, items.parent.categoryId, items.parent.retrospectiveId, '', children);
        this.translateService.get('GROUPITEM.UNNAMED')
        .switchMap((res: string) => {
          const groupWrapper = {
            categoryId: items.parent.categoryId,
            retrospectiveId: items.parent.retrospectiveId,
            children: [items.parent._id, items.child._id],
            summary: res
          };
          return this.itemService.create(this.token, groupWrapper);
        })
        .takeUntil(this.ngUnsubscribe)
        .subscribe(groupItems => {
          newGroup._id = groupItems._id;
          newGroup.summary = groupItems.summary;
        },
        (error: Error) => {
          console.log('error', error);
        });
      }
    }
  }

  removeItemFromCategory(child: Item): void {
    const category =  this.itemService.getItemCategory(this.categories, child);
    category.items.some( (item, index, itemsArray) => {
      if (item._id === child._id) {
        itemsArray.splice(index, 1);
        return true;
      }
    });
  }

  addItemInACategory(parentItem: Item): void {
    const category = this.itemService.getItemCategory(this.categories, parentItem);
    category.items.push(parentItem);
  }

  dragend(event) {
    if (!event.child) {
      const quantity = event.parent.children.length - 1;
      this.ungroupAllItems(event.parent, quantity);
    } else {
      this.itemService.ungroupItem(event.parent._id, event.child._id, this.token)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((item: Item) => {
        });
    }
  }

  ungroupAllItems(parent, quantity) {
    this.itemService.ungroupItem(parent._id, parent.children[quantity]._id, this.token)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: Item) => {
        if (quantity >= 2) {
          this.ungroupAllItems(parent, quantity - 1);
        }
      });
  }


  restoreItemIntoCategory(parentItem, childId) {
    parentItem.children = parentItem.children.filter(child => {
      return child._id !== childId;
    });
  }

  updateItem(event): void {
    if (!event.edited) {
      this.itemService.updateField(event.item._id, {summary: event.item.summary}, this.token).subscribe(
        (itemCreated: Item) => {
          event.item.editMode = false;
        },
        (error: Error) => {
          console.log('error', error);
        }
      );
    } else {
      event.item.editMode = false;
      this.clientSocketService.sendCancelCreateEditItem(event.item);
    }
  }

  startEdit(event) {
    this.clientSocketService.sendEditionStartItem(event);
  }

  getItemFromCategory(category, item) {
    return category.items.find(itemSearch => {
      return itemSearch._id === item._id;
    });
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
}
