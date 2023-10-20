import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocxGeneratorComponent } from './docx-generator.component';
import { HelloComponent } from './hello-component';


@NgModule(
    {
        providers: [],
        declarations: [
            DocxGeneratorComponent,
            HelloComponent],
        imports: [CommonModule,
            FormsModule],
        exports:[
            DocxGeneratorComponent
        ]
    }
)

export class DocxGeneratorModule { }