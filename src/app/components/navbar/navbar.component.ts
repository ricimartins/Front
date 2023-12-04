import { Component } from '@angular/core';
import { FranquiaFuncionarioService } from 'src/app/services/franquiafuncionario.service';
import { AuthService } from 'src/app/services/auth.service';
import { FranquiaFuncionario } from 'src/app/models/FranquiaFuncionario';
import { Franquia } from 'src/app/models/Franquia';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {

  constructor(private FranquiaFuncionarioService: FranquiaFuncionarioService, private AuthService: AuthService) { }

  listFranquia: Array<FranquiaFuncionario>;

  ngOnInit() {

    this.loadFranquia();
  }

  loadFranquia() {

    this.FranquiaFuncionarioService.ListaFranquiaFuncionarioByEmail(this.AuthService.getEmailUser())
      .subscribe((response: Array<FranquiaFuncionario>) => {
        this.listFranquia = response;
      }, (error) => console.error(error),
        () => { })

  }

  onSelect(event) {
    if (event.isUserInput) {
      // Salva franquia na sessão
      localStorage.setItem('idFranquia', event.source.value);      
    }
  }

}
