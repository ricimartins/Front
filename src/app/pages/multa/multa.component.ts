import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Multa } from 'src/app/models/Multa';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { MultaService } from 'src/app/services/multa.service';
import { MenuService } from 'src/app/services/menu.service';
import { OrgaoAutuadorService } from 'src/app/services/orgaoautuador.service';
import { OrgaoAutuador } from 'src/app/models/OrgaoAutuador';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'multa',
  templateUrl: './multa.component.html',
  styleUrls: ['./multa.component.scss']
})

export class MultaComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, public MultaService: MultaService,
    public OrgaoAutuadorService: OrgaoAutuadorService, private router: Router,
    private route: ActivatedRoute) { }

  //#region Variáveis globais
  listOrgaosAutuadores = new Array<SelectModel>();
  multaForm: FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListMultas: Array<Multa>;
  id: string;
  rowId: number = 0;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  listOrgaoAutuador: Array<OrgaoAutuador>;
  dropdownListOrgaoAutuador = [];
  selectedOrgaoAutuador = [];
  dropdownSettingsOrgaoAutuador = {};


  ngOnInit() {
    debugger
    this.menuService.menuSelecionado = 7;

    this.multaForm = this.formBuilder.group(
      {
        codigo: ['', [Validators.required]],
        descricao: ['', [Validators.required]],
        OrgaoAutuadorSelect: ['', [Validators.required]]
      }
    )
    this.ListagemMultas();
    this.configpag();
    this.DropDownConfig();
  }

  DropDownConfig() {

    //Veiculos
    this.dropdownSettingsOrgaoAutuador = {
      singleSelection: true,
      idField: 'Id',
      textField: 'Nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 1,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Orgão Autuador não cadastrado"
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
    this.ListarOrgaoAutuador();
    this.multaForm.reset();
    this.selectedOrgaoAutuador = new Array<OrgaoAutuador>;
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

  ListagemMultas() {

    this.tipoTela = 1;
    this.multaForm.reset();
    this.router.navigate(
      ['/multa']
    );

    this.MultaService.ListarMulta()
      .subscribe((response: Array<Multa>) => {

        this.tableListMultas = response;

      }, (error) => console.error(error),
        () => { })
  }

  // Pega os dados do form 
  dadosForm() {
    return this.multaForm.controls;
  }

  enviar() {

    let action;

    this.route.queryParamMap
      .subscribe(params => {
        action = params.get('action');
      });
    var dados = this.dadosForm();

    let item = new Multa();
    item.Id = 0;
    item.Codigo = dados["codigo"].value
    item.Descricao = dados["descricao"].value

    item.NomePropriedade = '';
    item.Mensagem = '';

    this.selectedOrgaoAutuador.forEach((currentValue, index) => {
      item.OrgaoAutuadorId = currentValue.Id;
    });

    if (action === 'edit') {
      //Recupero o Id do registro que está em edição
      item.Id = this.rowId;
      this.MultaService.AtualizarMulta(item)
        .subscribe((response: Multa) => {

          alert('Alterado com sucesso!')
          this.ListagemMultas();

        }, (error) => console.error(error),
          () => { })
    }
    else {
      this.MultaService.AdicionarMulta(item)
        .subscribe((response: Multa) => {

          alert('Cadastrado com sucesso!')
          this.ListagemMultas();

        }, (error) => console.error(error),
          () => { })


    }        
  }

  ListarOrgaoAutuador() {

    this.OrgaoAutuadorService.ListarOrgaoAutuador()
      .subscribe((response: Array<OrgaoAutuador>) => {

        this.listOrgaoAutuador = response;
        this.dropdownListOrgaoAutuador = this.listOrgaoAutuador;
      }
      )
  }

  //#region Métodos dropdown  
  onItemSelectOrgaoAutuador(item: any) {
    this.selectedOrgaoAutuador = [];
    this.selectedOrgaoAutuador.push(item);
  }

  onDeSelectOrgaoAutuador(item: any) {
    this.selectedOrgaoAutuador = this.selectedOrgaoAutuador.filter((el) => el !== item);
    this.listOrgaoAutuador = new Array<OrgaoAutuador>();
  }
  //#endregion

  //#region Métodos de exclusão e alteração
  OnclickEdit(row) {
    this.loadCadastro(row);
    this.tipoTela = 2;
    this.selectedOrgaoAutuador = new Array<OrgaoAutuador>();
    this.router.navigate(
      ['/multa'],
      { queryParams: { 'id': row['Id'], 'action': 'edit' } }
    );
  }

  OnclickDelete(row) {
    this.MultaService.DeleteMulta(row.Id)
      .subscribe((response: Multa) => {
        alert('Excluído com sucesso!')
        this.ListagemMultas();
      }, (error) => console.error(error),
        () => { })
  }

  loadCadastro(row: any) {

    this.tipoTela = 2;
    this.ListarOrgaoAutuador();
    this.MultaService.ObterMulta(row.Id)
      .subscribe((response: Array<Multa>) => {
        this.rowId = row.Id;

        this.multaForm.patchValue(
          {
            codigo: row.Codigo,
            descricao: row.Descricao
          }
        );

        //Recupera o Orgão Autuador do cliente
        this.OrgaoAutuadorService.ObterOrgaoAutuador(row.OrgaoAutuador.Id)
          .subscribe((response: Array<OrgaoAutuador>) => {

            this.selectedOrgaoAutuador = new Array<OrgaoAutuador>();
            response.forEach((currentValue, index) => {
              this.selectedOrgaoAutuador.push(currentValue);
            });

          }, (error) => console.error(error),
            () => { })

      }, (error) => console.error(error),
        () => { })
  }
  //#endregion    
}
