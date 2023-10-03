import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfracaoComponent } from './infracao.component';


const routes: Routes = [{
    path: '',
    component: InfracaoComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class InfracaoRoutingModule{}