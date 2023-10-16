import { CommonModule } from "@angular/common";
import { InfracaoRoutingModule } from "./infracao-routing-module";
import { InfracaoComponent } from "./infracao.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";

@NgModule(
    {   
        providers:[],
        declarations:[InfracaoComponent],
        imports:[
            CommonModule,
            InfracaoRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule,
            NgMultiSelectDropDownModule.forRoot(),
            MatTabsModule,
            MatButtonModule,
            MatMenuModule
        ]
    }
)

export class InfracaoModule{}