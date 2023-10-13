import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/Cliente';
import { Franquia } from 'src/app/models/Franquia';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Veiculo } from 'src/app/models/Veiculo';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { VeiculoService } from 'src/app/services/veiculo.service';

@Component({
  selector: 'cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public franquiaService: FranquiaService, public authService: AuthService,
    public clienteService: ClienteService,private router : Router, 
    private route: ActivatedRoute, public veiculoService: VeiculoService) {}

  //#region Variáveis globais
  listFranquias = new Array<SelectModel>();
  franquiaSelect = new SelectModel();
  clienteForm : FormGroup;
  veiculosForm : FormGroup;
  tipoTela: number = 1; // 1 listagem, 0 cadastro
  tableListClientes: Array<Cliente>;
  tableListVeiculos: Array<Veiculo>;
  id: string;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  rowId:number=0;    
  dropdownListVeiculos = [];
  selectedItemsVeiculos = [];
  dropdownSettingsVeiculos = {};
  //#endregion

  ngOnInit(){        
    
    this.dropdownSettingsVeiculos = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Placa',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Veículos não cadastrados"
    };

    this.menuService.menuSelecionado = 4;
    
    this.clienteForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          telefone: ['', [Validators.required]],
          email: ['', [Validators.required]],
          cpf: ['', [Validators.required]],
          endereco: ['', [Validators.required]],
          dataNascimento: ['', [Validators.required]],
          franquiaSelect:['', [Validators.required]]
        }
      )
      this.ListagemClientes();        
      this.configpag();
    }

    onItemSelect(item: any) {
      console.log(item);
    }
    onSelectAll(items: any) {
      console.log(items);
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
    this.tipoTela = 0;
    this.ListarFranquia();
    this.ListarVeiculos();
    this.clienteForm.reset();
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
  
  ListagemClientes() {
    this.tipoTela = 1;
    this.clienteForm.reset();
    this.router.navigate(
      ['/cliente']
    ); 
    
    this.clienteService.ListarCliente()
      .subscribe((response: Array<Cliente>) => {

        this.tableListClientes = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm(){
      return this.clienteForm.controls;
    }

    enviar(){
      
      let action;
      
      this.route.queryParamMap
       .subscribe(params => {
             action = params.get('action');     
      });

      var dados = this.dadosForm();                     
      let item = new Cliente();
  
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Telefone = dados["telefone"].value;
      item.Email = dados["email"].value;      
      item.DataNascimento = dados["dataNascimento"].value;            
      item.CPF = dados["cpf"].value == "" ? null : dados["cpf"].value;      
      item.Endereco = dados["endereco"].value;      
      
      item.NomePropriedade = '';
      item.Mensagem = '';
      
      if (action === 'edit'){
        //Recupero o Id do registro que estão em edição
        item.Id = this.rowId;   
        this.clienteService.AtualizarCliente(item)
        .subscribe((response: Cliente) => {
          
          alert('Alterado com sucesso!')
          this.ListagemClientes();          

        }, (error) => console.error(error),
          () => { })
      }
      else{
        this.clienteService.AdicionarCliente(item)
          .subscribe((response: Cliente) => {
    
            //verifica se existe veículo selecionado
            if (this.tableListVeiculos.length > 0){
              
              this.tableListVeiculos.forEach((currentValue, index) => {
                //cadastra os veículos selecionados
                this.veiculoService.AdicionarVeiculo(this.tableListVeiculos[index])
                .subscribe((response: Veiculo) => {                                

                }, (error) => console.error(error),
                  () => { })
            });            
          }

        this.clienteForm.reset();                

        }, (error) => console.error(error),
          () => { })

        }  
      }

    ListarFranquia(){
      
      this.franquiaService.ListarFranquia()
        .subscribe((response: Array<Franquia>) => {
        
          var lisFranquia = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;
                
                lisFranquia.push(item);
          });

          this.listFranquias = lisFranquia;
      }         
      )
    }

    //#region Métodos de exclusão e alteração
    OnclickEdit(row){            
      this.loadCadastro(row);
      this.tipoTela = 0;      
      
      this.router.navigate(
        ['/cliente'],
        { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
      );      
    }

    OnclickDelete(row){                  
      this.clienteService.DeleteCliente(row.Id)
        .subscribe((response: Cliente) => {
          alert('Excluído com sucesso!')
          this.ListagemClientes();
        }, (error) => console.error(error),
          () => { })
    }  

    loadCadastro(row : any){
    
      this.tipoTela = 0;
      this.ListarFranquia();
      let franquiaSelect = new SelectModel();        
  
      this.clienteService.ListarClienteById(row.Id)
        .subscribe((response: Array<Cliente>) => {
          this.rowId = row.Id;                              
          
          this.clienteForm.patchValue(
            {
              name : row.Nome,
              cpf : row.CPF,
              telefone : row.Telefone,
              email : row.Email,
              endereco : row.Endereco,
              dataNascimento : row.DataNascimento,
              franquiaSelect : {
                id : row.Franquia.Id,
                name : row.Franquia.Nome
              }              
            }
          );          
                  
        }, (error) => console.error(error),
          () => { })              
      }
    //#endregion      

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {        
      //this.tipoTela = tabChangeEvent.index;
      
      // switch(tabChangeEvent.index)
      // {
      //   case 0: {
      //     this.tipoTela = tabChangeEvent.index
      //     break;
      //   }         
      //   case 1: {
      //     this.tipoTela = tabChangeEvent.index
      //     break;
      //   }
      //   default: 
      //     // 
      //     break;      
      // }    
    }

    ListarVeiculos() {                
      
      this.veiculoService.ListarVeiculo()
        .subscribe((response: Array<Veiculo>) => {
            
          this.tableListVeiculos = response;
          this.dropdownListVeiculos = this.tableListVeiculos
  
        }, (error) => console.error(error),
          () => { })
    }
}
