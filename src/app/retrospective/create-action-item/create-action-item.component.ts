import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from './../models/item.model';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OnFocusDirective } from './../category-item/onfocus.directive';

@Component({
  selector: 'app-create-action-item',
  templateUrl: './create-action-item.component.html',
  styleUrls: ['./create-action-item.component.css']
})

export class CreateActionItemComponent implements OnInit, OnChanges {

  @Input() item: Item;
  @Output() actionItem: EventEmitter<string>;
  @Input() playerRole;
  actionItemForm: FormGroup;
  retrospectiveId: string;
  action;
  typeItem = 'action-item';

  constructor(private fb: FormBuilder, private router: ActivatedRoute) {
    this.actionItemForm = this.fb.group({
      actionItem: [this.action, Validators.required]
    });
    this.actionItem = new EventEmitter<string>();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.action = changes.item.currentValue.actionItem;
    this.actionItemForm.setValue({ actionItem: [this.action]});
    this.item.actionItem = this.action;
  }

  ngOnInit() {
    this.router.parent.params.subscribe(param => {
      this.retrospectiveId = param['id'];
    });
  }

  saveActionItem(form) {
    this.actionItem.emit(form.actionItem);
  }

  saveActionItemOnKeyEvent(event) {
    if (event.keyCode === 13) {
      if (this.actionItemForm.value.actionItem.trim() !== '') {
        this.actionItem.emit(this.actionItemForm.value.actionItem.trim());
      }
    }
  }
}
