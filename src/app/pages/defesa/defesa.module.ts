import { CommonModule } from "@angular/common";
import { DefesaRoutingModule } from "./defesa-routing-module";
import { DefesaComponent } from "./defesa.component";
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
import { DocxGeneratorModule } from "src/app/components/docx-generator/docx-generator.module";

@NgModule(
    {   
        providers:[],
        declarations:[DefesaComponent],
        imports:[
            CommonModule,
            DefesaRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule,
            NgMultiSelectDropDownModule.forRoot(),
            MatTabsModule,
            MatIconModule,
            MatButtonModule,
            MatMenuModule,
            DocxGeneratorModule
        ]
    }
)

export class DefesaModule{}