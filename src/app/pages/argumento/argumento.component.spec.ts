import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentoComponent } from './argumento.component';

describe('ArgumentoComponent', () => {
  let component: ArgumentoComponent;
  let fixture: ComponentFixture<ArgumentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArgumentoComponent]
    });
    fixture = TestBed.createComponent(ArgumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
