import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, private router: Router, private route: ActivatedRoute) { }  

  //#region Variáveis globais    
  homeForm: FormGroup;
  //#endregion

  ngOnInit() {
    debugger
    this.menuService.menuSelecionado = 1;
  }



  // Pega os dados do form 
  dadosForm() {
    return this.homeForm.controls;
  }

}
