import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Infracao } from 'src/app/models/Infracao';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { InfracaoService } from 'src/app/services/infracao.service';
import { MenuService } from 'src/app/services/menu.service';
import { VeiculoService } from 'src/app/services/veiculo.service';
import { Veiculo } from 'src/app/models/Veiculo';
import { Multa } from 'src/app/models/Multa';
import { MultaService } from 'src/app/services/multa.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'infracao',
  templateUrl: './infracao.component.html',
  styleUrls: ['./infracao.component.scss']
})
export class InfracaoComponent { 
   
  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public veiculoService: VeiculoService, public authService: AuthService,
    public infracaoService: InfracaoService, public MultaService: MultaService, public ClienteService: ClienteService) {}

listVeiculos = new Array<SelectModel>();
veiculoSelect = new SelectModel();

listMultas = new Array<SelectModel>();
multaSelect = new SelectModel();

listClientes = new Array<SelectModel>();
clienteSelect = new SelectModel();

  infracaoForm : FormGroup;

  ngOnInit(){
    debugger
    this.menuService.menuSelecionado = 6;
    
    this.infracaoForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          telefone: ['', [Validators.required]],
          email: ['', [Validators.required]],
          veiculoSelect:['', [Validators.required]],
          multaSelect:['', [Validators.required]],
          clienteSelect:['', [Validators.required]]
        }
      )
      this.ListagemInfracoes();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListInfracoes: Array<Infracao>;
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
    this.ListarVeiculo();
    this.ListarMultas();
    this.ListarClientes();
    this.infracaoForm.reset();
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
  
  ListagemInfracoes() {
    this.tipoTela = 1;
    
    this.infracaoService.ListarInfracao()
      .subscribe((response: Array<Infracao>) => {

        this.tableListInfracoes = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.infracaoForm.controls;
    }

    enviar(){
      
      var dados = this.dadosForm();      

      let item = new Infracao();
      item.Id = 0;
      item.VeiculoId = parseInt(this.veiculoSelect.id);
      item.MultaId = parseInt(this.multaSelect.id);
      item.ClienteId = parseInt(this.clienteSelect.id);
      
      item.NomePropriedade = '';
      item.Mensagem = '';

      this.infracaoService.AdicionarInfracao(item)
        .subscribe((response: Infracao) => {
  
      this.infracaoForm.reset();                

      }, (error) => console.error(error),
        () => { })

      }  

    ListarVeiculo(){
      
      this.veiculoService.ListarVeiculo()
        .subscribe((response: Array<Veiculo>) => {
        
          var lisVeiculo = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();                
                
                lisVeiculo.push(item);
          });

          this.listVeiculos = lisVeiculo;
      }         
      )
    }

    ListarMultas(){
      
      this.MultaService.ListarMulta()
        .subscribe((response: Array<Multa>) => {
        
          var lisMulta = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();                
                
                lisMulta.push(item);
          });

          this.listMultas = lisMulta;
      }         
      )
    }

    ListarClientes(){
      
      this.ClienteService.ListarCliente()
        .subscribe((response: Array<Multa>) => {
        
          var lisCliente = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();                
                
                lisCliente.push(item);
          });

          this.listClientes = lisCliente;
      }         
      )
    }
}
