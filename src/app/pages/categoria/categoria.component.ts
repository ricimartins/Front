import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/Categoria';
import { SistemaFinanceiro } from 'src/app/models/SistemaFinanceiro';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MenuService } from 'src/app/services/menu.service';
import { SistemaService } from 'src/app/services/sistema.service';

@Component({
  selector: 'categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public sistemaService: SistemaService, public authService: AuthService,
    public categoriaService: CategoriaService) {}

listSistemas = new Array<SelectModel>();
sistemaSelect = new SelectModel();

  categoriaForm : FormGroup;

  ngOnInit(){
    debugger
    this.menuService.menuSelecionado = 3;
    
    this.categoriaForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          sistemaSelect:['', [Validators.required]]
        }
      )
      this.ListagemCategorias();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListCategorias: Array<Categoria>;
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
    this.ListaSistemasUsuario();
    this.categoriaForm.reset();
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
  
  ListagemCategorias() {
    this.tipoTela = 1;
    
    this.categoriaService.ListarCategoriasUsuario(this.authService.getEmailUser())
      .subscribe((response: Array<Categoria>) => {

        this.tableListCategorias = response;

      }, (error) => console.error(error),
        () => { })

  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.categoriaForm.controls;
    }

    enviar(){
      debugger;
      var dados = this.dadosForm();      

      let item = new Categoria();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.IdSistema = parseInt(this.sistemaSelect.id);      

      this.categoriaService.AdicionarCategoria(item)
        .subscribe((response: Categoria) => {
  
      this.categoriaForm.reset();                

      }, (error) => console.error(error),
        () => { })

      }  

    ListaSistemasUsuario(){
      
      this.sistemaService.ListaSistemasUsuario(this.authService.getEmailUser())
        .subscribe((response: Array<SistemaFinanceiro>) => {
        
          var lisSistemaFinanceiro = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;
                
                lisSistemaFinanceiro.push(item);
          });

          this.listSistemas = lisSistemaFinanceiro;
      }         
      )
    }
}
