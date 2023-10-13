import { CommonModule } from "@angular/common";
import { VeiculoRoutingModule } from "./veiculo-routing-module";
import { VeiculoComponent } from "./veiculo.component";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatMenuModule } from "@angular/material/menu";

@NgModule(
    {   
        providers:[],
        declarations:[VeiculoComponent],
        imports:[
            CommonModule,
            VeiculoRoutingModule,
            NavbarModule,
            SidebarModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule,
            NgxPaginationModule,
            MatIconModule,
            MatTabsModule,
            MatMenuModule
        ]
    }
)

export class VeiculoModule{}