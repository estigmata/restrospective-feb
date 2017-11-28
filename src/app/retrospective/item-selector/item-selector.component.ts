import { Component, Input } from '@angular/core';
import { Retrospective } from './../../shared/retrospective.model';
import { Item } from './../models/item.model';
import { Category } from './../../shared/category.model';
@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.css']
})

export class ItemSelectorComponent {

  @Input() item: Item;
  @Input() category: Category;
  retrospective: Retrospective;
}
