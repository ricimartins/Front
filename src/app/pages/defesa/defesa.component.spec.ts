import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefesaComponent } from './defesa.component';

describe('DefesaComponent', () => {
  let component: DefesaComponent;
  let fixture: ComponentFixture<DefesaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefesaComponent]
    });
    fixture = TestBed.createComponent(DefesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
