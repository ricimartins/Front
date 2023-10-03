import { CommonModule } from "@angular/common";
import { MultaRoutingModule } from "./multa-routing-module";
import { MultaComponent } from "./multa.component";
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
        declarations:[MultaComponent],
        imports:[
            CommonModule,
            MultaRoutingModule,
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

export class MultaModule{}