import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective implements OnInit {
  @Input() playerRole;
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    if (this.playerRole !== 'Moderator') {
      this.elementRef.nativeElement.draggable = false;
    }
  }
}
