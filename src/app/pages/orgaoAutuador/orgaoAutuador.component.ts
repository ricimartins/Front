import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgaoAutuador } from 'src/app/models/OrgaoAutuador';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { OrgaoAutuadorService } from 'src/app/services/orgaoautuador.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'orgaoaAutuador',
  templateUrl: './orgaoautuador.component.html',
  styleUrls: ['./orgaoautuador.component.scss']
})
export class OrgaoAutuadorComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder, 
    public orgaoautuadorService: OrgaoAutuadorService, public authService: AuthService) {}

  orgaoautuadorForm : FormGroup;

  ngOnInit(){
  
  this.menuService.menuSelecionado = 8;

  this.configpag();
  this.ListaOrgaoAutuador();
  
  this.orgaoautuadorForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        uf: ['', [Validators.required]]
        
      }
    )
  }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListOrgaoAutuadors: Array<OrgaoAutuador>;
  id: string;

  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10

  configpag() {
    this.id = this.gerarIdParaConfigDePaginacao();

    this.config = {
      id: this.id,
      currentPage: this.page,
      itemsPerPage: this.itemsPorPagina

    };
  }

  gerarIdParaConfigDePaginacao() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  cadastro()
  {
    this.tipoTela = 2;
    this.orgaoautuadorForm.reset();
  }

  mudarItemsPorPage() {
    this.page = 1
    this.config.currentPage = this.page;
    this.config.itemsPerPage = this.itemsPorPagina;
  }

  mudarPage(event: any) {
    this.page = event;
    this.config.currentPage = this.page;
  }
  

  ListaOrgaoAutuador() {
    this.tipoTela = 1;
        
    this.orgaoautuadorService.ListarOrgaoAutuador() 
      .subscribe((response: Array<OrgaoAutuador>) => {

        this.tableListOrgaoAutuadors = response;

      }, (error) => console.error(error),
        () => { })

  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.orgaoautuadorForm.controls;
    }

    enviar(){
      
      var dados = this.dadosForm();      

      let item = new OrgaoAutuador();
      item.Id = 0;
      item.Nome = dados["name"].value;      
      item.UF = dados["uf"].value;

      item.NomePropriedade = '';
      item.Mensagem = '';

      this.orgaoautuadorService.AdicionarOrgaoAutuador(item)
        .subscribe((response: OrgaoAutuador) => {
  
      this.orgaoautuadorForm.reset();
      debugger      

      }, (error) => console.error(error),
        () => { })

      }        
    
    }

  

