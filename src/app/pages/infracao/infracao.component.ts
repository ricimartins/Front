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
import { TemplateArgumento, TemplateDefesa } from 'src/app/models/TemplateDefesa';
import { DocumentCreatorNew } from 'src/app/components/docx-generator/cv-generator_new';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Funcionario } from 'src/app/models/Funcionario';

@Component({
  selector: 'infracao',
  templateUrl: './infracao.component.html',
  styleUrls: ['./infracao.component.scss']
})
export class InfracaoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public VeiculoService: VeiculoService, public authService: AuthService,
    public infracaoService: InfracaoService, public MultaService: MultaService, public ClienteService: ClienteService,
    public VeiculoClienteService: VeiculoClienteService, private router: Router, public FuncionarioService: FuncionarioService,
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

  listCliente: Array<Cliente>;
  dropdownListCliente = [];
  selectedCliente = [];
  dropdownSettingsCliente = {};

  listMulta: Array<Multa>;
  dropdownListMulta = [];
  selectedMulta = [];
  dropdownSettingsMulta = {};

  action: string = '';
  dados: TemplateDefesa;
  funcionarioId :number;  
  infracao : Infracao;

  //#endregion

  ngOnInit() {

    this.menuService.menuSelecionado = 6;

    this.infracaoForm = this.formBuilder.group(
      {
        pontuacao: ['', [Validators.required]],
        data: ['', [Validators.required]],
        veiculoSelect: ['', [Validators.required]],
        multaSelect: ['', [Validators.required]],
        clienteSelect: ['', [Validators.required]]
      }
    )

    this.ListagemInfracoes();
    this.configpag();
    this.DropDownConfig();
    this.BuscaFuncionario();
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

    this.infracao = new Infracao();
    this.infracao.Id = 0;
    this.infracao.Pontuacao = dados["pontuacao"].value;
    this.infracao.Data = dados["data"].value;
    this.infracao.FuncionarioId = this.funcionarioId;

    this.selectedCliente.forEach((currentValue, index) => {
      this.infracao.ClienteId = currentValue.Id;
    });
    this.selectedVeiculo.forEach((currentValue, index) => {
      this.infracao.VeiculoId = currentValue.Id;
    });
    this.selectedMulta.forEach((currentValue, index) => {
      this.infracao.MultaId = currentValue.Id;
    });

    this.infracao.NomePropriedade = '';
    this.infracao.Mensagem = '';

    if (action === 'edit') {
      //Recupero o Id do registro que está em edição
      this.infracao.Id = this.rowId;
      this.infracaoService.AtualizarInfracao(this.infracao)
        .subscribe((response: Infracao) => {

          alert('Alterado com sucesso!')
          this.ListagemInfracoes();

        }, (error) => console.error(error),
          () => { })
    }
    else {
      this.infracaoService.AdicionarInfracao(this.infracao)
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
    this.dropdownListVeiculo = this.listVeiculo;
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

  OnClickDefesa(row) {

    this.router.navigate(
      ['/defesa'],
      { queryParams: { 'id': row.Id, 'action': 'new' } }
    );
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
            pontuacao: row.Pontuacao,
            data: row.Data.toLocaleString().substring(0, 10)
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

  download(): void {

    this.GeraDadosDocumento();
    const documentCreator = new DocumentCreatorNew();
    const doc = documentCreator.create([this.dados.Autoridade, this.dados.Assunto, this.dados.Cliente, this.dados.Argumento]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }

  GeraDadosDocumento() {
    this.dados = new TemplateDefesa();
    this.dados.Autoridade = "À Autoridade Competente do DETRAN para apreciar e julgar Defesa Prévia";
    this.dados.Assunto = "Assunto: Apresentação de Defesa à autuação de trânsito de número TE00355137";
    this.dados.Cliente = "DANRLEY BUZIKI DE VARGAS,brasileiro, solteiro(a), ESTUDANTE, portador do CPF nº 024.760.620-06, documento de identidade nº 2122436534, CNH nº 6975807606, residente e domiciliado na RUA EDACY MARTINS, nº 520, , Bairro SECULO XX, em CAXIAS DO SUL/Rio Grande do Sul, CEP 95057423, tendo sido autuado(a)pela condução do veículo de placas QUA9B82, RENAVAN nº 1194772614, representado(a) neste ato por seu procurador/sua procuradora RODRIGO DUTRA NUNES, brasileiro(a), casado(a), portador do CPF nº 964.702.910-15, documento de identidade nº 9064842934, OAB nº OAB/RS 103.736, escritório Avenida Ipiranga - Praia de Belas, Porto Alegre 40 sala 1610, 51997497224, onde recebe intimações e despachos, vem, com base no § 4º do art. 4º c/c art. 9º da Resolução nº 619/2016, Defesa Prévia à autuação de trânsito de número TE00355137 pelas seguintes razões:"

    this.dados.Argumento = new Array<TemplateArgumento>();

    this.dados.Argumento.push(
      {
        Descricao: "Titulo argumento 2",
        Detalhe: "Teste de argumento 2"
      }
    );
  }

  BuscaFuncionario(){
    this.FuncionarioService.ListarFuncionarioEmail(this.authService.getEmailUser())
      .subscribe((response: Array<Funcionario>) => {
        response.forEach((currentValue, index) => {
          this.funcionarioId = currentValue.Id
        });                
      }, (error) => console.error(error),
        () => { })
  }
}
