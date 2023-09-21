import { CommonModule } from "@angular/common";
import { CategoriaRoutingModule } from "./categoria-routing-module";
import { CategoriaComponent } from "./categoria.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from '@angular/material/icon';

@NgModule(
    {   
        providers:[],
        declarations:[CategoriaComponent],
        imports:[
            CommonModule,
            CategoriaRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule
        ]
    }
)

export class CategoriaModule{}