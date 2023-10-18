import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefesaComponent } from './defesa.component';


const routes: Routes = [{
    path: '',
    component: DefesaComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class DefesaRoutingModule{}