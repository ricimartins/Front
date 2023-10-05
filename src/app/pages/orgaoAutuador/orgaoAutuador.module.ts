import { CommonModule } from "@angular/common";
import { OrgaoAutuadorRoutingModule } from "./orgaoAutuador-routing-module";
import { OrgaoAutuadorComponent } from "./orgaoAutuador.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatIconModule } from '@angular/material/icon';

@NgModule(
    {   
        providers:[],
        declarations:[OrgaoAutuadorComponent],
        imports:[
            CommonModule,
            OrgaoAutuadorRoutingModule,
            NavbarModule,
            SidebarModule,
            ReactiveFormsModule,
            NgxPaginationModule,
            FormsModule,
            NgSelectModule,
            MatIconModule
        ]
    }
)

export class OrgaoAutuadorModule{}