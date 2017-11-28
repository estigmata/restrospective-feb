import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteItemComponent } from './vote-item.component';

describe('VoteItemComponent', () => {
  let component: VoteItemComponent;
  let fixture: ComponentFixture<VoteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
