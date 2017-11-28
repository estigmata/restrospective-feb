import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Item } from './models/item.model';
import { Category } from './../shared/category.model';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Player } from './models/player.model';
import { PlayerService } from '../shared/player.service';

@Injectable()
export class ItemService {

  constructor(private http: HttpClient, private playerService: PlayerService) { }

  create(token, item): Observable<Item> {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.post<Item>(`${environment.backendPath}items`,
      item, {headers: header})
      .map((newItem: Item) => newItem);
  }

  getAll(retrospectiveId: string): Observable<Item[]> {
    return this.http.get(`${environment.backendPath}retrospectives/${retrospectiveId}/items`)
      .map( (wrapper: Item[]) => {
        return wrapper;
        }
      );
  }

  updateField(itemId, field, token: string) {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.put<Item>(`${environment.backendPath}items/${itemId}`,
      field, {headers: header})
      .map((updatedItem: Item) => {
        return updatedItem;
      });
  }

  setChild(parentId: string, childId: string, token: string): Observable<Item> {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.post<Item>(`${environment.backendPath}items/${parentId}`,
      {child: childId}, {headers: header})
      .map((updatedItem: Item) => {
        return updatedItem;
      });
  }

  delete(item, token: string): Observable<Item> {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.delete(`${environment.backendPath}items/${item._id}`,{ headers: header })
      .map(
        (deletedItem: Item ) => {
          return deletedItem;
        }
      );
  }

  setCategoryInfoOnChildrenItems(items: Item[], categories: Category[]): void {
    const childCategory = new Category('', '', []);
    items.forEach( item => {
      item.children.map( child => {
       this.setcategoryInfoOnChildItem(item, child, categories);
      });
    });
  }

  setcategoryInfoOnChildItem(parentItem: Item, childItem: Item, categories: Category[]): void {
    if (parentItem.categoryId !== childItem.categoryId) {
      const categoryChild = this.getItemCategory(categories, childItem);
      childItem.color = categoryChild.color;
      childItem.categoryName = categoryChild.name;
    }
  }
  private findCategory(categoryId: string, categories: Category[]): Category {
    return categories.find( category => {
      return category._id === categoryId;
    });
  }

  updateVotes(itemId: string, value: number, playerId: string, token): Observable<Player> {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.put(`${environment.backendPath}items/${itemId}/votes`,
      { 'playerId': playerId, voteValue: value }, { headers: header })
      .map( (player: Player) => {
        this.playerService.setPlayerInSessionStorage(player);
        return player;
      });
  }

  getItemCategory(categories: Category[], item: Item): Category {
    return categories.find(selectedCategory => {
      return selectedCategory._id === item.categoryId;
    });
  }

  ungroupItem(itemId: string, childId: string, token: string): Observable<Item> {
    const header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.put(`${environment.backendPath}items/${itemId}/ungroup`,
    { 'childId': childId }, { headers: header })
    .map((item: Item) => item);
  }
}
