import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArgumentoComponent } from './argumento.component';


const routes: Routes = [{
    path: '',
    component: ArgumentoComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class ArgumentoRoutingModule{}