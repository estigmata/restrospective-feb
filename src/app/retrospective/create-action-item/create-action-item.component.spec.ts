import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActionItemComponent } from './create-action-item.component';

describe('CreateActionItemComponent', () => {
  let component: CreateActionItemComponent;
  let fixture: ComponentFixture<CreateActionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
