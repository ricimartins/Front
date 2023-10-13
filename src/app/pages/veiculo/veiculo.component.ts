import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from 'src/app/models/Veiculo';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { VeiculoService } from 'src/app/services/veiculo.service';
import { MenuService } from 'src/app/services/menu.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'veiculo',
  templateUrl: './veiculo.component.html',
  styleUrls: ['./veiculo.component.scss']
})
export class VeiculoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public clienteService: ClienteService, public authService: AuthService,
    public veiculoService: VeiculoService,private router : Router, 
    private route: ActivatedRoute) {}

  //#region Variáveis globais  
  veiculoForm : FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro
  tableListVeiculos: Array<Veiculo>;
  id: string;  
  rowId: number = 0; // Id selecionado para edição  
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  //#endregion

  ngOnInit(){    
    this.menuService.menuSelecionado = 5;
    
    this.veiculoForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          placa: ['', [Validators.required]],
          renavam: ['', [Validators.required]],
          marca: ['', [Validators.required]],
          modelo: ['', [Validators.required]],
          ano: ['', [Validators.required]],
          cor: ['', [Validators.required]],
          chassi: ['', [Validators.required]]          
        }
      )
      this.ListagemVeiculos();        
      this.ListarCliente();
      this.configpag();
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
    this.ListarCliente();
    this.veiculoForm.reset();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
    this.tipoTela = tabChangeEvent.index;

    switch(tabChangeEvent.index)
    {
      case 0: {
        this.router.navigate(
          ['/veiculo']
        );     
        this.veiculoForm.reset();
        break;
      } 
      case 1:{        
        break;
      }
      default: 
        // 
        break;      
    }    
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

  OnclickEdit(row){      
    this.loadCadastro(row);
    this.tipoTela = 2;      
    
    this.router.navigate(
      ['/veiculo'],
      { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
    );          
  }

  OnclickDelete(row){      
    this.veiculoService.DeleteVeiculo(row.Id)
      .subscribe((response: Veiculo) => {
        alert('Excluído com sucesso!')
        this.ListagemVeiculos();                              
      }, (error) => console.error(error),
        () => { })
  }
  
  //Carrega dados do cadastro
  loadCadastro(row : any)
  {    
    this.tipoTela = 2;
    this.ListarCliente();    

    this.veiculoService.ListarVeiculoById(row.Id)
        .subscribe((response: Array<Veiculo>) => {
          this.rowId = row.Id;                              
          
          this.veiculoForm.patchValue(
            {
              name : row.Nome,
              placa : row.Placa,
              renavam : row.Renavam,
              marca : row.Marca,
              modelo : row.Modelo,
              ano : row.Ano,
              cor: row.Cor,
              chassi: row.Chassi              
            }
          );          
                  
        }, (error) => console.error(error),
          () => { })        
  }
  
  ListagemVeiculos() {
    this.tipoTela = 1;
    this.veiculoForm.reset();
    this.router.navigate(
      ['/veiculo']
    ); 
    
    this.veiculoService.ListarVeiculo()
      .subscribe((response: Array<Veiculo>) => {

        this.tableListVeiculos = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.veiculoForm.controls;
    }

    enviar(){
      let action;
      
      this.route.queryParamMap
       .subscribe(params => {
             action = params.get('action');     
      });

      var dados = this.dadosForm();      

      let item = new Veiculo();      
      item.Id = 0;
      item.Placa = dados["placa"].value;
      item.Renavam = dados["renavam"].value;
      item.Marca = dados["marca"].value;
      item.Modelo = dados["modelo"].value;
      item.Ano = dados["ano"].value;
      item.Cor = dados["cor"].value;
      item.Chassi = dados["chassi"].value;      

      item.NomePropriedade = '';
      item.Mensagem = '';

      if (action === 'edit'){
        //Recupero o Id do registro que estão em edição
        item.Id = this.rowId;
        this.veiculoService.AtualizarVeiculo(item)
        .subscribe((response: Veiculo) => {
          
          alert('Alterado com sucesso!')
          this.ListagemVeiculos();          

        }, (error) => console.error(error),
          () => { })
      }
      else{

        this.veiculoService.AdicionarVeiculo(item)
          .subscribe((response: Veiculo) => {
    
        this.veiculoForm.reset();
        this.ListagemVeiculos()     
        alert('Cadastrado com sucesso!');

        }, (error) => console.error(error),
          () => { })
      }
    }  

    ListarCliente(){
      
      this.clienteService.ListarCliente()
        .subscribe((response: Array<Cliente>) => {
        
          var lisCliente = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;
                
                lisCliente.push(item);
          });          
      }         
      )
    }
}
