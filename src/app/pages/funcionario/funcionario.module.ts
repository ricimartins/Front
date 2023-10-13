import { CommonModule } from "@angular/common";
import { FuncionarioRoutingModule } from "./funcionario-routing-module";
import { FuncionarioComponent } from "./funcionario.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule(
    {   
        providers:[],
        declarations:[FuncionarioComponent],
        imports:[
            CommonModule,
            FuncionarioRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule,
            MatButtonModule,
            MatMenuModule,
            MatDialogModule,
            NgMultiSelectDropDownModule.forRoot()
        ],        
    }
)

export class FuncionarioModule{}