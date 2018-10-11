import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDelegationComponent } from './check-delegation.component';

describe('CheckDelegationComponent', () => {
  let component: CheckDelegationComponent;
  let fixture: ComponentFixture<CheckDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckDelegationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
