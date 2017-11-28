import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../models/item.model';
import { Category } from '../../shared/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  public formItem = false;
  @Output() created = new EventEmitter<Item>();
  @Output() voted = new EventEmitter();
  @Output() grouped = new EventEmitter();
  @Output() ungrouped = new EventEmitter();
  @Output() deleted = new EventEmitter<Item>();
  @Output() changed = new EventEmitter<void>();
  @Input() configuration;
  @Input() category: Category;
  @Output() createdItem = new EventEmitter();
  @Output() startEdit = new EventEmitter();
  @Input() role;
  onEditionFinished(newItem) {
    this.created.emit(newItem);
  }

  onItemDeleted(currentItem) {
    this.deleted.emit(currentItem);
  }

  createItem() {
    const newItem = new Item('', this.category._id , '' , '', [], true, '');
    this.category.items.unshift(newItem);
    this.createdItem.emit(newItem);
  }

  updateItemVotes(event, item) {
    this.voted.emit({quantity: event, item: item});
  }

  groupItems(itemGroup) {
    this.grouped.emit(itemGroup);
  }

  dragend(event) {
    this.ungrouped.emit(event);
  }

  editionStart(event) {
    this.startEdit.emit(event);
  }
}
