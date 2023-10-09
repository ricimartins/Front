import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './pages/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'franquia',
    loadChildren: () => import('./pages/franquia/franquia.module').then(m => m.FranquiaModule),
    canActivate:[AuthGuard]
  }
  ,
  {
    path: 'funcionario',
    loadChildren: () => import('./pages/funcionario/funcionario.module').then(m => m.FuncionarioModule),
    canActivate:[AuthGuard]
  }
  ,
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate:[AuthGuard]
  }
  ,
  {
    path: 'veiculo',
    loadChildren: () => import('./pages/veiculo/veiculo.module').then(m => m.VeiculoModule),
    canActivate:[AuthGuard]
  }
  ,
  {
    path: 'infracao',
    loadChildren: () => import('./pages/infracao/infracao.module').then(m => m.InfracaoModule),
    canActivate:[AuthGuard]
  }
  ,
  {
    path: 'multa',
    loadChildren: () => import('./pages/multa/multa.module').then(m => m.MultaModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'orgaoAutuador',
    loadChildren: () => import('./pages/orgaoAutuador/orgaoAutuador.module').then(m => m.OrgaoAutuadorModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'argumento',
    loadChildren: () => import('./pages/argumento/argumento.module').then(m => m.ArgumentoModule),
    canActivate:[AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }