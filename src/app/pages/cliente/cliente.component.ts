import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/Cliente';
import { Franquia } from 'src/app/models/Franquia';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Veiculo } from 'src/app/models/Veiculo';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { VeiculoService } from 'src/app/services/veiculo.service';
import { VeiculoClienteService } from 'src/app/services/veiculocliente.service';
import { VeiculoCliente } from 'src/app/models/VeiculoCliente';

@Component({
  selector: 'cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public franquiaService: FranquiaService, public authService: AuthService,
    public clienteService: ClienteService, private router: Router,
    private route: ActivatedRoute, public veiculoService: VeiculoService,
    public veiculoClienteService: VeiculoClienteService) { }

  //#region Variáveis globais
  clienteForm: FormGroup;
  veiculosForm: FormGroup;
  tipoTela: number = 1; // 1 listagem, 2 cadastro
  tableListClientes: Array<Cliente>;
  tableListVeiculos: Array<Veiculo>;
  id: string;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  rowId: number = 0;
  dropdownListVeiculos = [];
  selectedVeiculos = [];
  dropdownSettingsVeiculos = {};
  //#endregion

  ngOnInit() {

    this.dropdownSettingsVeiculos = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Placa',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 3,
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
        numeroCNH: ['', [Validators.required]],
        validadeCNH: ['', [Validators.required]],
        veiculoSelect: ['', [Validators.required]],
      }
    )
    this.ListagemClientes();
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

  mudarItemsPorPage() {
    this.page = 1
    this.config.currentPage = this.page;
    this.config.itemsPerPage = this.itemsPorPagina;
  }

  mudarPage(event: any) {
    this.page = event;
    this.config.currentPage = this.page;
  }

  cadastro() {
    this.tipoTela = 2;
    this.ListarVeiculos();
    this.clienteForm.reset();
    this.selectedVeiculos = new Array<Veiculo>();
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
  dadosForm() {
    return this.clienteForm.controls;
  }

  enviar() {

    let action;

    this.route.queryParamMap
      .subscribe(params => {
        action = params.get('action');
      });

    var dados = this.dadosForm();
    let cliente = new Cliente();

    cliente.Nome = dados["name"].value;
    cliente.Id = 0;
    cliente.Telefone = dados["telefone"].value;
    cliente.Email = dados["email"].value;
    cliente.DataNascimento = dados["dataNascimento"].value;
    cliente.CPF = dados["cpf"].value == "" ? null : dados["cpf"].value;
    cliente.Endereco = dados["endereco"].value;
    cliente.NumeroCNH = dados["numeroCNH"].value;
    cliente.ValidadeCNH = dados["validadeCNH"].value;

    cliente.NomePropriedade = '';
    cliente.Mensagem = '';

    if (action === 'edit') {
      //Recupero o Id do registro que estão em edição
      cliente.Id = this.rowId;
      this.clienteService.AtualizarCliente(cliente)
        .subscribe((response: Cliente) => {



          // Busco as veiculos do cliente para cadastrar novamente
          this.veiculoClienteService.ObterVeiculoCliente(cliente.Id)
            .subscribe((response: Array<VeiculoCliente>) => {

              //Remove todas as franquias atuais
              response.forEach((currentValue, index) => {
                this.veiculoClienteService.DeleteVeiculoCliente(currentValue.Id)
                  .subscribe((response: Array<VeiculoCliente>) => {
                  }, (error) => console.error(error),
                    () => { })
              });

              this.selectedVeiculos.forEach((currentValue, index) => {
                var veiculoCliente = new VeiculoCliente();
                veiculoCliente.Id = 0;
                veiculoCliente.VeiculoId = currentValue.Id
                veiculoCliente.ClienteId = cliente.Id;
                veiculoCliente.Mensagem = '';
                veiculoCliente.NomePropriedade = '';

                // Cadastra novamente as franquias do Funcionario
                this.veiculoClienteService.AdicionarVeiculoCliente(veiculoCliente)
                  .subscribe((response: VeiculoCliente) => {

                  }, (error) => console.error(error),
                    () => { })
              });

              alert('Alterado com sucesso!')
              this.ListagemClientes();

            }, (error) => console.error(error),
              () => { })
        }, (error) => console.error(error),
          () => { })
    }
    else {
      this.clienteService.AdicionarCliente(cliente)
        .subscribe((response: Cliente) => {

          //verifica se existe veículo selecionado
          if (this.tableListVeiculos.length > 0) {

            this.tableListVeiculos.forEach((currentValue, index) => {

              var veiculoCliente = new VeiculoCliente();
              veiculoCliente.Id = 0;
              veiculoCliente.ClienteId = response.Id;
              veiculoCliente.VeiculoId = currentValue.Id;
              veiculoCliente.Mensagem = '';
              veiculoCliente.NomePropriedade = '';

              //cadastra o veículo 
              this.veiculoClienteService.AdicionarVeiculoCliente(veiculoCliente)
                .subscribe((response: VeiculoCliente) => {

                }, (error) => console.error(error),
                  () => { })
            });
          }

          this.clienteForm.reset();
          this.ListagemClientes();

        }, (error) => console.error(error),
          () => { })

    }
  }

  //#region Métodos de exclusão e alteração
  OnclickEdit(row) {
    this.loadCadastro(row);
    this.tipoTela = 2;
    this.selectedVeiculos = new Array<Veiculo>();
    this.router.navigate(
      ['/cliente'],
      { queryParams: { 'id': row['Id'], 'action': 'edit' } }
    );
  }

  OnclickDelete(row) {
    this.clienteService.DeleteCliente(row.Id)
      .subscribe((response: Cliente) => {
        alert('Excluído com sucesso!')
        this.ListagemClientes();
      }, (error) => console.error(error),
        () => { })
  }

  loadCadastro(row: any) {

    this.tipoTela = 2;
    this.ListarVeiculos();
    this.clienteService.ListarClienteById(row.Id)
      .subscribe((response: Array<Cliente>) => {
        this.rowId = row.Id;

        this.clienteForm.patchValue(
          {
            name: row.Nome,
            cpf: row.CPF,
            telefone: row.Telefone,
            email: row.Email,
            endereco: row.Endereco,
            dataNascimento: row.DataNascimento,
            numeroCNH: row.NumeroCNH,
            validadeCNH: row.validadeCNH
          }
        );

        //Recupera os veiculos do cliente
        this.veiculoClienteService.ObterVeiculoCliente(row.Id)
          .subscribe((response: Array<VeiculoCliente>) => {

            this.selectedVeiculos = new Array<Veiculo>();
            response.forEach((currentValue, index) => {
              this.selectedVeiculos.push(currentValue.Veiculo);
            });

          }, (error) => console.error(error),
            () => { })

      }, (error) => console.error(error),
        () => { })
  }
  //#endregion      

  //#region Métodos dropdown
  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
    this.selectedVeiculos = new Array<Veiculo>();
    items.forEach((currentValue, index) => {
      this.selectedVeiculos.push(currentValue);
    });
  }

  onDeSelect(item: any) {
    this.selectedVeiculos = this.selectedVeiculos.filter((el) => el !== item);
  }

  onDeSelectAll(item: any) {
    this.selectedVeiculos = new Array<Veiculo>();
  }
  //#endregion

  ListarVeiculos() {

    this.veiculoService.ListarVeiculo()
      .subscribe((response: Array<Veiculo>) => {

        this.tableListVeiculos = response;
        this.dropdownListVeiculos = this.tableListVeiculos

      }, (error) => console.error(error),
        () => { })
  }
}
