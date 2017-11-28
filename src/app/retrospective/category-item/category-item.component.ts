import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Item } from '../models/item.model';
import { OnFocusDirective } from './onfocus.directive';
import { DragDropDirective } from './drag-drop.directive';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})

export class CategoryItemComponent {

  @Output() voted = new EventEmitter();
  @Output() editionFinished = new EventEmitter();
  @Output() deleted = new EventEmitter<Item>();
  @Output() grouped = new EventEmitter();
  @Output() ungrouped = new EventEmitter();
  @Input() item: Item;
  @Input() configuration;
  @Output() editionStart = new EventEmitter();
  itemForm: FormGroup;
  @Input() role;
  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.createForm();
  }

  createForm() {
    this.itemForm = this.fb.group({
        summary: ['', Validators.compose([Validators.required, Validators.maxLength(1000)])]
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
      if (result === 'accept') {
        this.deleteItem();
      }
    });
  }

  saveItem(newItem): void {
    if (newItem.summary !== this.item.summary) {
      Object.assign(this.item, newItem);
      this.editionFinished.emit({ item: this.item });
    }
  }

  deleteItem() {
    this.deleted.emit(this.item);
  }

  voteItemDown() {
    this.voted.emit(-1);
  }

  voteItemUp() {
    this.voted.emit(1);
  }

  dropItem(child: Item) {
    this.grouped.emit({
      parent: this.item,
      child: child
    });
  }

  enableEdition() {
    this.item.editMode = true;
    this.editionStart.emit({ _id: this.item._id, categoryId: this.item.categoryId });
  }

  cancelCreateEditItem() {
    this.editionFinished.emit({ item: this.item, edited: true });
  }

  dragend(child, parent) {
    this.ungrouped.emit({child: child, parent: parent});
  }

  saveItemOnKeyEvent(event) {
    if (event.keyCode === 13) {
      if (this.itemForm.value.summary.trim() !== '') {
        this.saveItem(this.itemForm.value);
      }
    } else if (event.keyCode === 27) {
      this.cancelCreateEditItem();
    }
  }

  ungroupAllItems(parent) {
    this.ungrouped.emit({ parent: parent });
  }
}
