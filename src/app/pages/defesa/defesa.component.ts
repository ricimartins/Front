import { Component, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Defesa } from 'src/app/models/Defesa';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { DefesaService } from 'src/app/services/defesa.service';
import { MenuService } from 'src/app/services/menu.service';
import { ArgumentoService } from 'src/app/services/argumento.service';
import { ArgumentoDefesaService } from 'src/app/services/argumentodefesa.service';
import { Argumento } from 'src/app/models/Argumento';
import { ActivatedRoute, Router } from '@angular/router';
import { Multa } from 'src/app/models/Multa';
import { MultaService } from 'src/app/services/multa.service';
import { MultaArgumentoService } from 'src/app/services/multaargumento.service';
import { InfracaoService } from 'src/app/services/infracao.service';
import { MultaArgumento } from 'src/app/models/MultaArgumento';
import { TemplateArgumento, TemplateDefesa } from 'src/app/models/TemplateDefesa';
import { DocumentCreatorNew } from 'src/app/components/docx-generator/cv-generator_new';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { Infracao } from 'src/app/models/Infracao';
import { ArgumentoDefesa } from 'src/app/models/ArgumentoDefesa';

@Component({
  selector: 'defesa',
  templateUrl: './defesa.component.html',
  styleUrls: ['./defesa.component.scss']
})

export class DefesaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, public DefesaService: DefesaService,
    private ArgumentoService: ArgumentoService, private router: Router,
    private route: ActivatedRoute, private MultaService: MultaService,
    private MultaArgumentoService: MultaArgumentoService, public InfracaoService: InfracaoService,
    private ArgumentoDefesaService: ArgumentoDefesaService) { }



  //#region Variáveis globais
  clienteId: number = 0;
  argumentoHTML: string;
  defesaForm: FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro
  tableListDefesas: Array<Defesa>;
  id: string;
  rowId: number = 0;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10

  infracao: Array<Infracao>;

  listArgumento: Array<Argumento>;
  dropdownListArgumento = [];
  selectedArgumento = [];
  dropdownSettingsArgumento = {};

  action: string = "";
  dadosDocumento: TemplateDefesa;
  infracaoId: number;
  //#endregion


  ngOnInit() {
    ;
    this.menuService.menuSelecionado = 10;

    this.defesaForm = this.formBuilder.group(
      {
        ArgumentoSelect: ['', [Validators.required]],
        numero: ['', [Validators.required]]
      }
    )


    this.route.queryParamMap
      .subscribe(params => {
        this.action = params.get('action');
        if (this.action == 'new') {
          this.infracaoId = parseInt(params.get('id'));
          this.tipoTela = 2;
          this.ObterInfracao(this.infracaoId);
        }
        else {
          this.ListagemDefesas();
        }
      });

    this.DropDownConfig();
    this.configpag();

    this.argumentoHTML = '';
  }

  DropDownConfig() {

    this.dropdownSettingsArgumento = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Descricao',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Argumento não cadastrado"
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
    this.defesaForm.reset();
    this.selectedArgumento = new Array<Argumento>;
    this.ListarArgumento();
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

  ListagemDefesas() {

    this.tipoTela = 1;
    this.defesaForm.reset();
    this.router.navigate(
      ['/defesa']
    );

    this.DefesaService.ListarDefesa()
      .subscribe((response: Array<Defesa>) => {

        this.tableListDefesas = response;

      }, (error) => console.error(error),
        () => { })
  }

  // Pega os dados do form 
  dadosForm() {
    return this.defesaForm.controls;
  }

  enviar() {

    let action;

    this.route.queryParamMap
      .subscribe(params => {
        action = params.get('action');
      });

    var dados = this.dadosForm();

    let item = new Defesa();
    item.Id = 0;
    item.Data = new Date();
    item.Numero = dados["numero"].value
    item.InfracaoId = this.infracaoId;

    item.NomePropriedade = '';
    item.Mensagem = '';


    if (action === 'edit') {
      //Recupero o Id do registro que está em edição
      item.Id = this.rowId;
      this.DefesaService.AtualizarDefesa(item)
        .subscribe((response: Defesa) => {

          alert('Alterado com sucesso!')
          this.ListagemDefesas();

        }, (error) => console.error(error),
          () => { })
    }
    else {
      this.DefesaService.AdicionarDefesa(item)
        .subscribe((response: Defesa) => {

          this.selectedArgumento.forEach((currentValue, index) => {

            var argumentoDefesa = new ArgumentoDefesa();
            argumentoDefesa.Id = 0;
            argumentoDefesa.DefesaId = response.Id;
            argumentoDefesa.ArgumentoId = currentValue.Id;

            argumentoDefesa.Mensagem = '';
            argumentoDefesa.NomePropriedade = '';

            //cadastra os argumentos da defesa
            this.ArgumentoDefesaService.AdicionarArgumentoDefesa(argumentoDefesa)
              .subscribe((response: ArgumentoDefesa) => {

              }, (error) => console.error(error),
                () => { })

          });

          alert('Cadastrado com sucesso!')
          this.ListagemDefesas();

        }, (error) => console.error(error),
          () => { })
    }
  }

  ListarArgumentoByMulta(MultaId) {

    this.MultaArgumentoService.ListarByMulta(MultaId)
      .subscribe((response: Array<MultaArgumento>) => {

        this.listArgumento = new Array<Argumento>();
        response.forEach((currentValue, index) => {
          this.listArgumento.push(currentValue.Argumento);
        });

        this.dropdownListArgumento = this.listArgumento;
      }
      )
  }

  ListarArgumento() {

    this.ArgumentoService.ListarArgumento()
      .subscribe((response: Array<Argumento>) => {

        this.listArgumento = new Array<Argumento>();
        response.forEach((currentValue, index) => {
          this.listArgumento.push(currentValue);
        });
        this.dropdownListArgumento = this.listArgumento;
      }
      )
  }

  //#region Métodos dropdown  
  onItemSelectArgumento(item: any) {
    this.ArgumentoHTML();
  }

  onDeSelectArgumento(item: any) {
    this.selectedArgumento = this.selectedArgumento.filter((el) => el !== item);
    this.listArgumento = new Array<Argumento>();
    this.ArgumentoHTML();
  }
  onSelectAllArgumento(items: any) {
    this.selectedArgumento = new Array<Argumento>();
    items.forEach((currentValue, index) => {
      this.selectedArgumento.push(currentValue);
    });
    this.ArgumentoHTML();
  }

  onDeSelectAllArgumento(item: any) {
    this.selectedArgumento = new Array<Argumento>();
    this.ArgumentoHTML();
  }
  //#endregion

  ArgumentoHTML() {
    this.argumentoHTML = '';

    this.selectedArgumento.forEach((currentValue, index) => {

      this.ArgumentoService.ObterArgumento(currentValue.Id)
        .subscribe((response: Array<Argumento>) => {
          this.argumentoHTML = this.argumentoHTML.concat('<h1>Ordem: ');
          this.argumentoHTML = this.argumentoHTML.concat((index + 1).toString());
          this.argumentoHTML = this.argumentoHTML.concat('</h1>');
          this.argumentoHTML = this.argumentoHTML.concat('<h2>');
          this.argumentoHTML = this.argumentoHTML.concat(currentValue.Descricao);
          this.argumentoHTML = this.argumentoHTML.concat('</h2>');
          this.argumentoHTML = this.argumentoHTML.concat('<h3>');
          this.argumentoHTML = this.argumentoHTML.concat(response[0].Detalhe);
          this.argumentoHTML = this.argumentoHTML.concat('</h3>');
        });

    });

    // let posicao =
    //   this.selectedArgumento.forEach((currentValue, index) => {

    //     //Titulo
    //     this.argumentoHTML = this.argumentoHTML.concat('<h1>Ordem: ');
    //     this.argumentoHTML = this.argumentoHTML.concat((index + 1).toString());
    //     this.argumentoHTML = this.argumentoHTML.concat('</h1>');
    //     this.argumentoHTML = this.argumentoHTML.concat('<h3>');
    //     this.argumentoHTML = this.argumentoHTML.concat(currentValue.Descricao);
    //     this.argumentoHTML = this.argumentoHTML.concat('</h3>');
    //   });
  }



  //#region Métodos de exclusão e alteração
  OnclickEdit(row) {
    this.loadCadastro(row);
    this.tipoTela = 2;
    this.selectedArgumento = new Array<Argumento>();
    this.router.navigate(
      ['/defesa'],
      { queryParams: { 'id': row['Id'], 'action': 'edit' } }
    );
  }

  OnclickDelete(row) {
    this.DefesaService.DeleteDefesa(row.Id)
      .subscribe((response: Defesa) => {
        alert('Excluído com sucesso!')
        this.ListagemDefesas();
      }, (error) => console.error(error),
        () => { })
  }

  loadCadastro(row: any) {

    this.tipoTela = 2;
    this.DefesaService.ObterDefesa(row.Id)
      .subscribe((response: Array<Defesa>) => {
        this.rowId = row.Id;

        this.defesaForm.patchValue(
          {
            codigo: row.Codigo,
            descricao: row.Descricao
          }
        );

        //Recupera o Orgão Autuador do cliente
        this.ArgumentoService.ObterArgumento(row.Argumento.Id)
          .subscribe((response: Array<Argumento>) => {

            this.selectedArgumento = new Array<Argumento>();
            response.forEach((currentValue, index) => {
              this.selectedArgumento.push(currentValue);
            });

          }, (error) => console.error(error),
            () => { })

      }, (error) => console.error(error),
        () => { })
  }
  //#endregion      

  ObterInfracao(id) {

    this.InfracaoService.ObterInfracao(id)
      .subscribe((response: Array<Infracao>) => {
        response.forEach((currentValue, index) => {
          this.infracao = response;
          this.ListarArgumentoByMulta(currentValue.Multa.Id)
        });
      }
      )
  }

  ListarInfracao() {

    this.InfracaoService.ListarInfracao()
      .subscribe((response: Array<Infracao>) => {
        response.forEach((currentValue, index) => {
          this.infracao = response;
          this.ListarArgumentoByMulta(currentValue.Multa.Id)
        });
      }
      )
  }

  download(): void {

    this.dadosDocumento = new TemplateDefesa();
    var dados = this.dadosForm();
    this.infracao.forEach((currentValue, index) => {

      this.dadosDocumento.Autoridade = ("À Autoridade Competente do ").concat(currentValue.Multa.OrgaoAutuador.Nome).concat(" para apreciar e julgar Defesa Prévia");
      this.dadosDocumento.Assunto = ("Assunto: Apresentação de Defesa à autuação de trânsito de número ").concat(dados["numero"].value);
      this.dadosDocumento.Cliente =
        (currentValue.Cliente.Nome)
          .concat(", ")
          .concat(currentValue.Cliente.Nacionalidade)
          .concat(", ")
          .concat(currentValue.Cliente.EstadoCivil)
          .concat(", ")
          .concat(currentValue.Cliente.Profissao)
          .concat(", portador do CPF nº ")
          .concat(currentValue.Cliente.CPF)
          .concat(", documento de identidade nº ")
          .concat(currentValue.Cliente.RG)
          .concat(", residente e domiciliado na ")
          .concat(currentValue.Cliente.Endereco)
          .concat(", tendo sido autuado(a) pela condução do veículo de placas ")
          .concat(currentValue.Veiculo.Placa)
          .concat(", RENAVAN nº ")
          .concat(currentValue.Veiculo.Renavam)
          .concat(", representado(a) nesse ato por seu procurador/sua procuradora ")
          .concat(currentValue.Funcionario.Nome)
          .concat(", ")
          .concat(currentValue.Funcionario.Nacionalidade)
          .concat(", ")
          .concat(currentValue.Funcionario.EstadoCivil)
          .concat(", portador do CPF nº ")
          .concat(currentValue.Funcionario.CPF)
          .concat(", documento de identidade nº ")
          .concat(currentValue.Funcionario.RG)
          .concat(", OAB nº ")
          .concat(currentValue.Funcionario.NumeroOAB)
          .concat(", residente e domiciliado na ")
          .concat(currentValue.Funcionario.Endereco) // TO DO precisa refatorar filial para conseguir pegar o endereço do escritório
          .concat(",  onde recebe intimações e despachos, vem, com base no § 4º do art. 4º c/c art. 9º da Resolução nº 619/2016, Defesa Prévia à autuação de trânsito de número ")
          .concat(dados["numero"].value)
          .concat(" pelas seguintes razões ");


      this.dadosDocumento.Argumento = new Array<TemplateArgumento>();
      this.selectedArgumento.forEach((currentValue, index) => {

        this.ArgumentoService.ObterArgumento(currentValue.Id)
          .subscribe((response: Array<Argumento>) => {
            this.dadosDocumento.Argumento.push(
              {
                Descricao: currentValue.Descricao,
                Detalhe: this.listArgumento.find(x => x.Id === currentValue.Id).Detalhe
              }
            );
          });
      });

    });


    const documentCreator = new DocumentCreatorNew();
    const doc = documentCreator.create([this.dadosDocumento.Autoridade, this.dadosDocumento.Assunto, this.dadosDocumento.Cliente, this.dadosDocumento.Argumento]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }
}
