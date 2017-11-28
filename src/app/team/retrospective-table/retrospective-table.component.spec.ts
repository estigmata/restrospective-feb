import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveTableComponent } from './retrospective-table.component';

describe('RetrospectiveTableComponent', () => {
  let component: RetrospectiveTableComponent;
  let fixture: ComponentFixture<RetrospectiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrospectiveTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrospectiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
