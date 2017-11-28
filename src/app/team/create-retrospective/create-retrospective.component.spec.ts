import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRetrospectiveComponent } from './create-retrospective.component';

describe('CreateRetrospectiveComponent', () => {
  let component: CreateRetrospectiveComponent;
  let fixture: ComponentFixture<CreateRetrospectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRetrospectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRetrospectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
