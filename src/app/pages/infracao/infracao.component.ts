import { Component, Input } from '@angular/core';
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
import { Cliente } from 'src/app/models/Cliente';
import { VeiculoClienteService } from 'src/app/services/veiculocliente.service';
import { VeiculoCliente } from 'src/app/models/VeiculoCliente';
import { ActivatedRoute, EventType, Router } from '@angular/router';

@Component({
  selector: 'infracao',
  templateUrl: './infracao.component.html',
  styleUrls: ['./infracao.component.scss']
})
export class InfracaoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public VeiculoService: VeiculoService, public authService: AuthService,
    public infracaoService: InfracaoService, public MultaService: MultaService, public ClienteService: ClienteService,
    public VeiculoClienteService: VeiculoClienteService, private router: Router,
    private route: ActivatedRoute) { }


  //#region Variáveis globais
  infracaoForm: FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListInfracoes: Array<Infracao>;
  id: string;
  rowId: number = 0;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10

  listVeiculo: Array<Veiculo>;
  dropdownListVeiculo = [];
  selectedVeiculo = [];
  dropdownSettingsVeiculo = {};
  disabledVeiculoSelect: boolean = true;

  listCliente: Array<Cliente>;
  dropdownListCliente = [];
  selectedCliente = [];
  dropdownSettingsCliente = {};

  listMulta: Array<Multa>;
  dropdownListMulta = [];
  selectedMulta = [];
  dropdownSettingsMulta = {};

  //#endregion

  ngOnInit() {

    this.menuService.menuSelecionado = 6;

    this.infracaoForm = this.formBuilder.group(
      {
        pontuacao: ['', [Validators.required]],
        veiculoSelect: ['', [Validators.required]],
        multaSelect: ['', [Validators.required]],
        clienteSelect: ['', [Validators.required]]
      }
    )

    this.ListagemInfracoes();
    this.configpag();
    this.DropDownConfig();
  }


  DropDownConfig() {

    //Veiculos
    this.dropdownSettingsVeiculo = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Placa',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 1,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Veículo não cadastrado"
    };

    //Cliente
    this.dropdownSettingsCliente = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 1,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Cliente não cadastrado"
    };

    //Multa
    this.dropdownSettingsMulta = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Descricao',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 1,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Multa não cadastrada"
    };
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

  cadastro() {
    this.tipoTela = 2;
    this.infracaoForm.reset();

    this.ListagemCliente();
    this.ListagemMulta();
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
    this.infracaoForm.reset();
    this.router.navigate(
      ['/infracao']
    );

    this.infracaoService.ListarInfracao()
      .subscribe((response: Array<Infracao>) => {

        this.tableListInfracoes = response;

      }, (error) => console.error(error),
        () => { })
  }

  // Pega os dados do form 
  dadosForm() {
    return this.infracaoForm.controls;
  }

  enviar() {
    let action;

    this.route.queryParamMap
      .subscribe(params => {
        action = params.get('action');
      });

    var dados = this.dadosForm();

    let infracao = new Infracao();
    infracao.Id = 0;
    infracao.Pontuacao = dados["pontuacao"].value;
    this.selectedCliente.forEach((currentValue, index) => {
      infracao.ClienteId = currentValue.Id;
    });
    this.selectedVeiculo.forEach((currentValue, index) => {
      infracao.VeiculoId = currentValue.Id;
    });
    this.selectedMulta.forEach((currentValue, index) => {
      infracao.MultaId = currentValue.Id;
    });

    infracao.NomePropriedade = '';
    infracao.Mensagem = '';

    if (action === 'edit') {
      //Recupero o Id do registro que está em edição
      infracao.Id = this.rowId;
      this.infracaoService.AtualizarInfracao(infracao)
        .subscribe((response: Infracao) => {

          alert('Alterado com sucesso!')
          this.ListagemInfracoes();

        }, (error) => console.error(error),
          () => { })
    }
    else {
      this.infracaoService.AdicionarInfracao(infracao)
        .subscribe((response: Infracao) => {

          alert('Cadastrado com sucesso!')
          this.ListagemInfracoes();
        }, (error) => console.error(error),
          () => { })
    }

  }

  ListagemMulta() {

    this.MultaService.ListarMulta()
      .subscribe((response: Array<Multa>) => {

        this.listMulta = response;
        this.dropdownListMulta = this.listMulta;
      }
      )
  }

  ListagemCliente() {

    this.ClienteService.ListarCliente()
      .subscribe((response: Array<Cliente>) => {

        this.listCliente = response;
        this.dropdownListCliente = this.listCliente;
      }
      )
  }

  ListagemVeiculo(clienteId) {

    this.VeiculoClienteService.ObterVeiculoCliente(clienteId)
      .subscribe((response: Array<VeiculoCliente>) => {

        this.listVeiculo = new Array<Veiculo>();
        response.forEach((currentValue, index) => {
          this.listVeiculo.push(currentValue.Veiculo);
        });

        this.dropdownListVeiculo = this.listVeiculo;

        this.disabledVeiculoSelect = !(this.listCliente.length > 0);

      }, (error) => console.error(error),
        () => { })
  }

  //#region Métodos dropdown

  //Cliente
  onItemSelectCliente(item: any) {
    this.ListagemVeiculo(item.Id);
    this.selectedVeiculo = [];
  }

  onDeSelectCliente(item: any) {
    this.selectedCliente = this.selectedCliente.filter((el) => el !== item);
    this.listVeiculo = new Array<Veiculo>();
    this.selectedVeiculo = [];
    this.dropdownListVeiculo = this.listVeiculo
    this.disabledVeiculoSelect = true;
  }

  //Veiculo
  onItemSelectVeiculo(item: any) {
  }

  onDeSelectVeiculo(item: any) {
    this.selectedVeiculo = this.selectedVeiculo.filter((el) => el !== item);
  }

  //Multa
  onItemSelectMulta(item: any) {
  }

  onDeSelectMulta(item: any) {
    this.selectedMulta = this.selectedMulta.filter((el) => el !== item);
  }

  //#endregion

  //#region Métodos de exclusão e alteração
  OnclickEdit(row) {
    this.loadCadastro(row);
    this.tipoTela = 2;
    this.selectedCliente = new Array<Cliente>();
    this.selectedVeiculo = new Array<Veiculo>();
    this.selectedMulta = new Array<Multa>();
    this.router.navigate(
      ['/infracao'],
      { queryParams: { 'id': row['Id'], 'action': 'edit' } }
    );
  }

  OnclickDelete(row) {
    this.infracaoService.DeleteInfracao(row.Id)
      .subscribe((response: Infracao) => {
        alert('Excluído com sucesso!')
        this.ListagemInfracoes();
      }, (error) => console.error(error),
        () => { })
  }

  loadCadastro(row: any) {

    this.tipoTela = 2;
    this.ListagemCliente();
    this.ListagemVeiculo(row.ClienteId)
    this.ListagemMulta();
    this.infracaoService.ObterInfracao(row.Id)
      .subscribe((response: Array<Infracao>) => {
        this.rowId = row.Id;

        this.infracaoForm.patchValue(
          {
            pontuacao: row.Pontuacao
          }
        );

        this.selectedCliente = new Array<Cliente>();        
        this.selectedCliente.push(row.Cliente);
        this.selectedVeiculo = new Array<Veiculo>();
        this.selectedVeiculo.push(row.Veiculo);
        this.selectedMulta = new Array<Multa>();
        this.selectedMulta.push(row.Multa);                

      }, (error) => console.error(error),
        () => { })
  }
  //#endregion    
}
