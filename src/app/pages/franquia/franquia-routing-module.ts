import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FranquiaComponent } from './franquia.component';


const routes: Routes = [{
    path: '',
    component: FranquiaComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class FranquiaRoutingModule{}