import { CommonModule } from "@angular/common";
import { FranquiaRoutingModule } from "./franquia-routing-module";
import { FranquiaComponent } from "./franquia.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from "@angular/material/menu";

@NgModule(
    {   
        providers:[],
        declarations:[FranquiaComponent],
        imports:[
            CommonModule,
            FranquiaRoutingModule,
            NavbarModule,
            SidebarModule,
            ReactiveFormsModule,
            NgxPaginationModule,
            FormsModule,
            NgSelectModule,
            MatIconModule,
            MatMenuModule
        ]
    }
)

export class FranquiaModule{}