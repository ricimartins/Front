import { CommonModule } from "@angular/common";
import { ClienteRoutingModule } from "./cliente-routing-module";
import { ClienteComponent } from "./cliente.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import {MatTabsModule} from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule(
    {   
        providers:[],
        declarations:[ClienteComponent],
        imports:[
            CommonModule,
            ClienteRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule,
            MatButtonModule,
            MatMenuModule,
            MatTabsModule,    
            NgMultiSelectDropDownModule.forRoot()
        ]
    }
)

export class ClienteModule{}