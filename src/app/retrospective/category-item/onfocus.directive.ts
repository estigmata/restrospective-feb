import { Directive, ElementRef, OnInit, Input, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[focus-item]'
})
export class OnFocusDirective implements OnInit, AfterViewChecked {

  constructor(private element: ElementRef) {}

  @Input() typeItem;

  ngOnInit() {
    this.element.nativeElement.focus();
  }

  ngAfterViewChecked() {
    if (this.typeItem === 'action-item') {
      this.element.nativeElement.focus();
    }
  }
}
