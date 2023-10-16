import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Franquia } from 'src/app/models/Franquia';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'franquia',
  templateUrl: './franquia.component.html',
  styleUrls: ['./franquia.component.scss']
})
export class FranquiaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder, 
    public franquiaService: FranquiaService, public authService: AuthService,
    private router : Router, private route: ActivatedRoute) {}

  //#region Variáveis Globais
  franquiaForm : FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListFranquias: Array<Franquia>;
  id: string;
  rowId: number = 0;
  action: string="";

  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  //#endregion

  ngOnInit(){
  
  this.menuService.menuSelecionado = 2;

  this.configpag();
  this.ListaFranquias();
  
  this.franquiaForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        cnpj: ['', [Validators.required]],
        endereco: ['', [Validators.required]],
        telefone: ['', [Validators.required]],        
      }
    )
  }  

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
  

  ListaFranquias() {
    this.tipoTela = 1;  
    this.router.navigate(['/franquia']);      
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
      
      this.route.queryParamMap
       .subscribe(params => {
             this.action = params.get('action');     
      });      
    
    var dados = this.dadosForm();      

    let item = new Franquia();
    item.Id = 0;
    item.Nome = dados["name"].value;      
    item.CNPJ = dados["cnpj"].value;    
    item.Endereco = dados["endereco"].value;;
    item.Telefone = dados["telefone"].value;;      
    item.NomePropriedade = '';
    item.Mensagem = '';

    if (this.action === 'edit'){
      // Alteração
      item.Id = this.rowId;
      this.franquiaService.AtualizarFranquia(item)
        .subscribe((response: Franquia) => {
        
        alert('Alterado com sucesso!');

        this.tipoTela = 1;
        this.ListaFranquias(); 
           
      }, (error) => console.error(error),
        () => { })
    }
    else{
      // Cadastro
      this.franquiaService.AdicionarFranquia(item)
        .subscribe((response: Franquia) => {                          
          
          alert('Cadastrado com sucesso!');

      }, (error) => console.error(error),
        () => { })
    }
    
    this.franquiaForm.reset();        
        
  }

  loadCadastro(row : any)
  {    
    this.tipoTela = 2;        

    this.franquiaService.ObterFranquia(row.Id)
      .subscribe((response: Array<Franquia>) => {
        this.rowId = row.Id;
        this.franquiaForm.controls["name"].setValue(row.Nome);
        this.franquiaForm.controls["cnpj"].setValue(row.CNPJ);        
        this.franquiaForm.controls["endereco"].setValue(row.Endereco);
        this.franquiaForm.controls["telefone"].setValue(row.Telefone);        
                
      }, (error) => console.error(error),
        () => { })              
  }
  
  OnclickEdit(row){      
      
    this.rowId = row.Id;
    this.loadCadastro(row);
    this.tipoTela = 2;      
    
    this.router.navigate(
      ['/franquia'],
      { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
    );      
  }

  OnclickDelete(row){      
        
    this.franquiaService.DeleteFranquia(row.Id)
      .subscribe((response: Franquia) => {
        
        this.ListaFranquias();        
        alert('Excluído com sucesso!');                      

      }, (error) => console.error(error),
        () => { })
  }    
    
}

  

