import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Defesa } from 'src/app/models/Defesa';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { DefesaService } from 'src/app/services/defesa.service';
import { MenuService } from 'src/app/services/menu.service';
import { ArgumentoService } from 'src/app/services/argumento.service';
import { Argumento } from 'src/app/models/Argumento';
import { ActivatedRoute, Router } from '@angular/router';
import { Multa } from 'src/app/models/Multa';
import { MultaService } from 'src/app/services/multa.service';
import { MultaArgumentoService } from 'src/app/services/multaargumento.service';
import { MultaArgumento } from 'src/app/models/MultaArgumento';

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
    private MultaArgumentoService: MultaArgumentoService) { }



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
  listArgumento: Array<Argumento>;
  dropdownListArgumento = [];
  selectedArgumento = [];
  dropdownSettingsArgumento = {};

  listMulta: Array<Multa>;
  dropdownListMulta = [];
  selectedMulta = [];
  dropdownSettingsMulta = {};

  action: string = "";
  //#endregion


  ngOnInit() {
    debugger;
    this.menuService.menuSelecionado = 10;
    this.defesaForm = this.formBuilder.group(
      {
        ArgumentoSelect: ['', [Validators.required]]
      }
    )
    this.DropDownConfig();
    this.ListagemDefesas();
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
    this.ListagemMulta();
    this.defesaForm.reset();
    this.selectedArgumento = new Array<Argumento>;
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
    // item.Codigo = dados["codigo"].value
    // item.Descricao = dados["descricao"].value

    item.NomePropriedade = '';
    item.Mensagem = '';

    // this.selectedArgumento.forEach((currentValue, index) => {
    //   item.ArgumentoId = currentValue.Id;
    // });

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

  //Multa
  onItemSelectMulta(item: any) {
    this.ListarArgumentoByMulta(item.Id);
    this.selectedArgumento = [];
  }

  onDeSelectMulta(item: any) {
    this.selectedMulta = this.selectedMulta.filter((el) => el !== item);
    this.listArgumento = new Array<Argumento>();
    this.selectedArgumento = [];
    this.dropdownListArgumento = this.listArgumento;
  }
  //#endregion

  ArgumentoHTML() {
    this.argumentoHTML = '';
    let posicao =
      this.selectedArgumento.forEach((currentValue, index) => {

        //Titulo
        this.argumentoHTML = this.argumentoHTML.concat('<h1>Ordem: ');
        this.argumentoHTML = this.argumentoHTML.concat((index + 1).toString());
        this.argumentoHTML = this.argumentoHTML.concat('</h1>');
        this.argumentoHTML = this.argumentoHTML.concat('<h3>');
        this.argumentoHTML = this.argumentoHTML.concat(currentValue.Descricao);
        this.argumentoHTML = this.argumentoHTML.concat('</h3>');
      });
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
    this.ListagemMulta();
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

  ListagemMulta() {

    this.MultaService.ListarMulta()
      .subscribe((response: Array<Multa>) => {

        this.listMulta = response;
        this.dropdownListMulta = this.listMulta;
      }
      )
  }
}
