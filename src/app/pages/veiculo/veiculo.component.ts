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

listClientes = new Array<SelectModel>();
clienteSelect = new SelectModel();

  veiculoForm : FormGroup;

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
          chassi: ['', [Validators.required]],
          clienteSelect:['', [Validators.required]]
        }
      )
      this.ListagemVeiculos();        
      this.ListarCliente();
      this.configpag();
    }

  tipoTela: number = 0;// 1 listagem, 2 cadastro, 3 edição
  tableListVeiculos: Array<Veiculo>;
  id: string;
  // Id selecionado para edição  
  rowId: number = 0;

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
    this.tipoTela = 1;
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
    this.tipoTela = 1;      
    
    this.router.navigate(
      ['/veiculo'],
      { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
    );          
  }

  OnclickDelete(row){      
      
      
    // this.veiculoService.Delete(row.Id)
    //   .subscribe((response: Argumento) => {
        
    //     this.ListagemArgumentos();
    //     this.router.navigate(
    //       ['/argumento']
    //     );                      

    //   }, (error) => console.error(error),
    //     () => { })
  }
  
  //Carrega dados do cadastro
  loadCadastro(row : any)
  {    
    this.tipoTela = 1;
    this.ListarCliente();
    let clienteSelect = new SelectModel();        

    this.rowId = row.Id;
    this.veiculoForm.controls["name"].setValue(row.Nome);
    this.veiculoForm.controls["placa"].setValue(row.Placa);
    this.veiculoForm.controls["renavam"].setValue(row.Renavam);
    this.veiculoForm.controls["marca"].setValue(row.Marca);
    this.veiculoForm.controls["modelo"].setValue(row.Modelo);
    this.veiculoForm.controls["ano"].setValue(row.Ano);
    this.veiculoForm.controls["cor"].setValue(row.Cor);
    this.veiculoForm.controls["chassi"].setValue(row.Chassi);

    clienteSelect.id = row.Cliente.Id;
    clienteSelect.name = row.Cliente.Nome;
    this.veiculoForm.controls["clienteSelect"].setValue(clienteSelect);    
  }
  
  ListagemVeiculos() {
    this.tipoTela = 0;
    
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
      
      var dados = this.dadosForm();      

      let item = new Veiculo();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Placa = dados["placa"].value;
      item.Renavam = dados["renavam"].value;
      item.Marca = dados["marca"].value;
      item.Modelo = dados["modelo"].value;
      item.Ano = dados["ano"].value;
      item.Cor = dados["cor"].value;
      item.Chassi = dados["chassi"].value;
      item.ClienteId = parseInt(this.clienteSelect.id);

      item.NomePropriedade = '';
      item.Mensagem = '';

      this.veiculoService.AdicionarVeiculo(item)
        .subscribe((response: Veiculo) => {
  
      this.veiculoForm.reset();
      this.ListagemVeiculos()     
      alert('Cadastro realizado com sucesso!');

      }, (error) => console.error(error),
        () => { })

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

          this.listClientes = lisCliente;
      }         
      )
    }
}
