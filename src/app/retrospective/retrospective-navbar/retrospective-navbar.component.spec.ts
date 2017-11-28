import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrospectiveNavbarComponent } from './retrospective-navbar.component';

describe('RetrospectiveNavbarComponent', () => {
  let component: RetrospectiveNavbarComponent;
  let fixture: ComponentFixture<RetrospectiveNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrospectiveNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrospectiveNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
