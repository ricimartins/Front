import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./home-routing-module";
import { NgModule } from "@angular/core";
import { NavbarModule } from "src/app/components/navbar/navbar.module";
import { SidebarModule } from "src/app/components/sidebar/sidebar.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule(
    {
        providers: [],
        declarations: [HomeComponent],
        imports: [
            CommonModule,
            HomeRoutingModule,
            FormsModule,
            SidebarModule,
            NavbarModule,
            MatIconModule,
            MatCardModule,
            MatButtonModule
        ]
    }
)

export class HomeModule { }