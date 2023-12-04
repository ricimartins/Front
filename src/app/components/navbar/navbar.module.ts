import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { MenuComponent } from '../menu/menu.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule(
    {
        declarations: [NavbarComponent],
        imports: [CommonModule,
            FormsModule, 
            MenuComponent,
            MatFormFieldModule, 
            MatSelectModule],
        exports: [NavbarComponent]
    }
)

export class NavbarModule { }