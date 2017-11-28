import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingInUpComponent } from './sing-in-up.component';

describe('SingInUpComponent', () => {
  let component: SingInUpComponent;
  let fixture: ComponentFixture<SingInUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingInUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingInUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
