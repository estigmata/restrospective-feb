import { Component, OnInit, OnDestroy } from '@angular/core';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { ItemService } from '../item.service';
import { ActivatedRoute } from '@angular/router';
import { Retrospective } from '../../shared/retrospective.model';
import { Item } from '../models/item.model';
import { Category } from '../../shared/category.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.css']
})
export class ReportItemComponent implements OnInit, OnDestroy {

  retrospective: Retrospective;
  public items: Item[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private retrospectiveService: RetrospectiveService,
    private itemService: ItemService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data
    .takeUntil(this.ngUnsubscribe)
    .subscribe(({ resolverData: data }) => {
      this.retrospective = data.retrospective;
      this.retrospectiveService.updateRetrospectiveNextStep(this.retrospective);
      this.items = data.items.filter(item => {
        return item.actionItem;
      });
      this.itemService.setCategoryInfoOnChildrenItems(this.items, this.retrospective.categories);
      this.items.map(item => {
        this.setCategory(item, this.retrospective.categories);
      });
    },
    (error: Error) => {
      console.log(error);
    });
  }

  setCategory (item: Item, categories: Category[]): void {
    const categoryFound = categories.find(category => {
      return category._id  === item.categoryId;
    });
    item.categoryName = categoryFound.name;
    item.categoryColor = categoryFound.color;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
