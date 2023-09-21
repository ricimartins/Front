import { Component } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/Categoria';
import { Despesa } from 'src/app/models/Despesa';
import { SistemaFinanceiro } from 'src/app/models/SistemaFinanceiro';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { DespesaService } from 'src/app/services/despesa.service';
import { MenuService } from 'src/app/services/menu.service';
import { SistemaService } from 'src/app/services/sistema.service';

@Component({
  selector: 'despesa',
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.scss']
})
export class DespesaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public despesaService: DespesaService, public sistemaService: SistemaService,
    public authService: AuthService, public categoriaService: CategoriaService ) {}
  
  listSistemas = new Array<SelectModel>();
  sistemaSelect = new SelectModel();

  listCategorias = new Array<SelectModel>();
  categoriaSelect = new SelectModel();

  color = 'accent';
  checked = false;
  disabled = false;

  despesaForm : FormGroup;

  ngOnInit(){

    this.menuService.menuSelecionado = 4;
    
    this.despesaForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          valor: ['', [Validators.required]],
          data: ['', [Validators.required]],
          categoriaSelect: ['', [Validators.required]],
          sistemaSelect: ['', [Validators.required]]
        }
      )
      this.configpag();
      this.ListagemDespesas();      
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListDespesas: Array<Despesa>;
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
    this.ListarCategoriasUsuario();
    this.despesaForm.reset();
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
  
  ListagemDespesas() {
    debugger
    this.tipoTela = 1;
    
    this.despesaService.ListarDespesasUsuario(this.authService.getEmailUser())
      .subscribe((response: Array<Despesa>) => {

        this.tableListDespesas = response;

      }, (error) => console.error(error),
        () => { })

  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.despesaForm.controls;
    }

    enviar(){
      debugger;
      var dados = this.dadosForm();      

      let item = new Despesa();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Valor = dados["valor"].value;
      item.Pago = this.checked;
      item.DataVencimento = dados["data"].value;
      item.IdCategoria = parseInt(this.categoriaSelect.id);
      item.Mensagem = "";
      item.NomePropriedade = "";
      
      this.despesaService.AdicionarDespesa(item)
        .subscribe((response: Despesa) => {
  
      this.despesaForm.reset();                

      }, (error) => console.error(error),
        () => { })

      }    

    ListarCategoriasUsuario(){
      
      this.categoriaService.ListarCategoriasUsuario(this.authService.getEmailUser())
        .subscribe((response: Array<Categoria>) => {
        
          var lisCategoriaUsuario = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;
                
                lisCategoriaUsuario.push(item);
          });

          this.listCategorias = lisCategoriaUsuario;
      }         
      )
    }

    handleChangePago(item: any) {
      this.checked = item.checked as boolean;
    }
}
