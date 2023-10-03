import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Franquia } from 'src/app/models/Franquia';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';

@Component({
  selector: 'franquia',
  templateUrl: './franquia.component.html',
  styleUrls: ['./franquia.component.scss']
})
export class FranquiaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder, 
    public franquiaService: FranquiaService, public authService: AuthService) {}

  franquiaForm : FormGroup;

  ngOnInit(){
  
  this.menuService.menuSelecionado = 2;

  this.configpag();
  this.ListaFranquiasUsuario();
  
  this.franquiaForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        cnpj: ['', [Validators.required]],
        endereco: ['', [Validators.required]],
        telefone: ['', [Validators.required]],
        email: ['', [Validators.required]]
      }
    )
  }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListFranquias: Array<Franquia>;
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
    this.franquiaForm.reset();
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
  

  ListaFranquiasUsuario() {
    this.tipoTela = 1;
    
    //this.franquiaService.ListaFranquiasUsuario(this.authService.getEmailUser())
    this.franquiaService.ListarFranquia() 
      .subscribe((response: Array<Franquia>) => {

        this.tableListFranquias = response;

      }, (error) => console.error(error),
        () => { })

  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.franquiaForm.controls;
    }

    enviar(){
      debugger;
      var dados = this.dadosForm();      

      let item = new Franquia();
      item.Id = 0;
      item.Nome = dados["name"].value;      
      item.CNPJ = dados["cnpj"].value;;
      item.Email = dados["email"].value;;
      item.Endereco = dados["endereco"].value;;
      item.Telefone = dados["telefone"].value;;      
      item.NomePropriedade = '';
      item.Mensagem = '';

      this.franquiaService.AdicionarFranquia(item)
        .subscribe((response: Franquia) => {
  
      this.franquiaForm.reset();
      debugger
      // this.franquiaService.CadastrarUsuarioNoFranquia(response['Result']['Id'],this.authService.getEmailUser())
      //   .subscribe((response: any) => {
      //     debugger
      //   }, (error) => console.error(error),
      //     () => { })

      }, (error) => console.error(error),
        () => { })

      }        
    
    }

  

