import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgaoAutuadorComponent } from './orgaoAutuador.component';


const routes: Routes = [{
    path: '',
    component: OrgaoAutuadorComponent,
  }];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class OrgaoAutuadorRoutingModule{}