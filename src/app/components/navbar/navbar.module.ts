import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { MenuComponent } from '../menu/menu.component';


@NgModule(
    {
        declarations: [NavbarComponent],
        imports: [CommonModule,
            FormsModule, MenuComponent],
        exports: [NavbarComponent]
    }
)

export class NavbarModule { }