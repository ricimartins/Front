import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from 'src/app/models/Veiculo';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { VeiculoService } from 'src/app/services/veiculo.service';
import { MenuService } from 'src/app/services/menu.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'veiculo',
  templateUrl: './veiculo.component.html',
  styleUrls: ['./veiculo.component.scss']
})
export class VeiculoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public clienteService: ClienteService, public authService: AuthService,
    public veiculoService: VeiculoService) {}

listClientes = new Array<SelectModel>();
clienteSelect = new SelectModel();

  veiculoForm : FormGroup;

  ngOnInit(){
    debugger
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
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListVeiculos: Array<Veiculo>;
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
    this.ListarCliente();
    this.veiculoForm.reset();
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
  
  ListagemVeiculos() {
    this.tipoTela = 1;
    
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
