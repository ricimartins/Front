import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgaoAutuadorComponent } from './orgaoAutuador.component';

describe('OrgaoAutuadorComponent', () => {
  let component: OrgaoAutuadorComponent;
  let fixture: ComponentFixture<OrgaoAutuadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgaoAutuadorComponent]
    });
    fixture = TestBed.createComponent(OrgaoAutuadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
