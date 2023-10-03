import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Multa } from 'src/app/models/Multa';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { MultaService } from 'src/app/services/multa.service';
import { MenuService } from 'src/app/services/menu.service';
import { OrgaoAutuadorService } from 'src/app/services/orgaoautuador.service';
import { OrgaoAutuador } from 'src/app/models/OrgaoAutuador';

@Component({
  selector: 'multa',
  templateUrl: './multa.component.html',
  styleUrls: ['./multa.component.scss']
})

export class MultaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, public multaService: MultaService,
    public OrgaoAutuadorService: OrgaoAutuadorService ) {}

listOrgaosAutuadores = new Array<SelectModel>();
orgaoAutuadorSelect = new SelectModel();

  multaForm : FormGroup;

  ngOnInit(){
    debugger
    this.menuService.menuSelecionado = 7;
    
    this.multaForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          descricao: ['', [Validators.required]],
          orgaoAutuadorSelect: ['', [Validators.required]]
        }
      )
      this.ListagemMultas();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListMultas: Array<Multa>;
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
    this.ListarOrgaoAutuador();
    this.multaForm.reset();
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
  
  ListagemMultas() {
    debugger;
    this.tipoTela = 1;
    
    this.multaService.ListarMulta()
      .subscribe((response: Array<Multa>) => {

        this.tableListMultas = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.multaForm.controls;
    }

    enviar(){
      debugger;
      var dados = this.dadosForm();      

      let item = new Multa();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Descricao = dados["descricao"].value
      item.OrgaoAutuadorId = parseInt(this.orgaoAutuadorSelect.id)
      
      item.NomePropriedade = '';
      item.Mensagem = '';
      

      this.multaService.AdicionarMulta(item)
        .subscribe((response: Multa) => {
  
      this.multaForm.reset();                

      }, (error) => console.error(error),
        () => { })

      }  

    ListarOrgaoAutuador(){
      
      this.OrgaoAutuadorService.ListarOrgaoAutuador()
        .subscribe((response: Array<OrgaoAutuador>) => {
        
          var lisOrgaoAutuador = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;                
                
                lisOrgaoAutuador.push(item);
          });

          this.listOrgaosAutuadores = lisOrgaoAutuador;
      }         
      )
    }
}
