import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultaComponent } from './multa.component';


const routes: Routes = [{
    path: '',
    component: MultaComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class MultaRoutingModule{}