import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultaComponent } from './multa.component';

describe('MultaComponent', () => {
  let component: MultaComponent;
  let fixture: ComponentFixture<MultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultaComponent]
    });
    fixture = TestBed.createComponent(MultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
