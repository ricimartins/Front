import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocxGeneratorComponent } from './docx-generator.component';

describe('DocxGeneratorComponent', () => {
  let component: DocxGeneratorComponent;
  let fixture: ComponentFixture<DocxGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocxGeneratorComponent]
    });
    fixture = TestBed.createComponent(DocxGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
