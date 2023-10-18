import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';
import { DynamicModalComponent } from 'src/app/components/dynamic-modal/dynamic-modal.component';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, private router: Router, private route: ActivatedRoute,
    private modalService: ModalService) { }

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  sub!: Subscription;

  openModal() {
    // MyComponent é o componente que será renderizado dentro do seu body
    this.sub = this.modalService
      .openModal(this.entry, 'Título do modal', DynamicModalComponent)
      .subscribe((v) => {
        // dispara quando é aberto o modal
      });
  }

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
