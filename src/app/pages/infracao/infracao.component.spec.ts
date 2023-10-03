import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfracaoComponent } from './infracao.component';

describe('InfracaoComponent', () => {
  let component: InfracaoComponent;
  let fixture: ComponentFixture<InfracaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfracaoComponent]
    });
    fixture = TestBed.createComponent(InfracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
