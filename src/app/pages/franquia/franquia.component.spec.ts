import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranquiaComponent } from './franquia.component';

describe('FranquiaComponent', () => {
  let component: FranquiaComponent;
  let fixture: ComponentFixture<FranquiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FranquiaComponent]
    });
    fixture = TestBed.createComponent(FranquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
