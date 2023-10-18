import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicModalComponent } from './dynamic-modal.component';

@NgModule(
    {
        providers: [],
        declarations: [
            DynamicModalComponent],
        imports: [CommonModule,
            FormsModule],
        exports:[
            DynamicModalComponent
        ]
    }
)

export class DynamicModalModule { }