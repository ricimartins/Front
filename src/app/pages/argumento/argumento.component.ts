import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Argumento } from 'src/app/models/Argumento';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { ArgumentoService } from 'src/app/services/argumento.service';
import { MenuService } from 'src/app/services/menu.service';
import { MultaService } from 'src/app/services/multa.service';
import { Multa } from 'src/app/models/Multa';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MultaArgumento } from 'src/app/models/MultaArgumento';
import { MultaArgumentoService } from 'src/app/services/multaargumento.service';


@Component({
  selector: 'argumento',
  templateUrl: './argumento.component.html',
  styleUrls: ['./argumento.component.scss']
})

export class ArgumentoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, public argumentoService: ArgumentoService,
    public MultaService: MultaService, private router: Router,
    private route: ActivatedRoute, public multaArgumentoService: MultaArgumentoService) { }


  //#region Variáveis globais    
  tipoTela: number = 1; // 1 listagem, 2 cadastro
  tableListArgumentos: Array<Argumento>;
  id: string;
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  base64Output: string;
  // Id selecionado para edição  
  rowId: number = 0;
  argumentoForm: FormGroup;
  listMulta: Array<Multa>;
  dropdownListMulta = [];
  selectedMulta = [];
  dropdownSettingsMulta = {};
  //#endregion

  ngOnInit() {
    debugger

    this.menuService.menuSelecionado = 9;

    this.argumentoForm = this.formBuilder.group(
      {
        descricao: ['', [Validators.required]],
        detalhe: ['', [Validators.required]],
        MultaSelect: ['', [Validators.required]],
        anexo: ['', [Validators.required]]
      }
    )
    this.ListagemArgumentos();
    this.configpag();
    this.DropDownConfig();
  }

  DropDownConfig() {

    this.dropdownSettingsMulta = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Descricao',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      clientesShowLimit: 3,
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
    this.ListarMulta();
    this.selectedMulta = new Array<Multa>();
    this.argumentoForm.reset();
  }

  loadCadastro(row: any) {

    this.tipoTela = 2;
    this.ListarMulta();
    this.argumentoService.ObterArgumento(row.Id)
      .subscribe((response: Array<Argumento>) => {
        this.rowId = row.Id;

        this.argumentoForm.patchValue(
          {
            descricao: row.Descricao,
            detalhe: row.Detalhe,
            anexo: row.Anexo
          }
        );

        this.multaArgumentoService.ListarByArgumento(row.Id)
          .subscribe((response: Array<MultaArgumento>) => {

            this.selectedMulta = new Array<Multa>();
            response.forEach((currentValue, index) => {
              this.selectedMulta.push(currentValue.Multa);
            });

          }, (error) => console.error(error),
            () => { })
      }, (error) => console.error(error),
        () => { })
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

  ListagemArgumentos() {

    this.tipoTela = 1;

    this.router.navigate(
      ['/argumento']
    );

    this.argumentoService.ListarArgumento()
      .subscribe((response: Array<Argumento>) => {

        this.tableListArgumentos = response;

      }, (error) => console.error(error),
        () => { })
  }

  // Pega os dados do form 
  dadosForm() {
    return this.argumentoForm.controls;
  }

  enviar() {

    let action;

    this.route.queryParamMap
      .subscribe(params => {
        action = params.get('action');
      });

    var dados = this.dadosForm();

    let argumento = new Argumento();
    argumento.Id = 0;
    argumento.Descricao = dados["descricao"].value
    argumento.Detalhe = dados["detalhe"].value
    argumento.Anexo = this.base64Output;
    argumento.NomePropriedade = '';
    argumento.Mensagem = '';

    if (action === 'edit') {
      //Recupero o Id do registro que estão em edição
      argumento.Id = this.rowId;

      this.argumentoService.AtualizarArgumento(argumento)
        .subscribe((response: Argumento) => {

          // Busco as veiculos do cliente para cadastrar novamente
          this.multaArgumentoService.ListarByArgumento(argumento.Id)
            .subscribe((response: Array<MultaArgumento>) => {

              //Remove os veiculos atuais
              response.forEach((currentValue, index) => {
                this.multaArgumentoService.DeleteMultaArgumento(currentValue.Id)
                  .subscribe((response: Array<MultaArgumento>) => {
                  }, (error) => console.error(error),
                    () => { })
              });

              this.selectedMulta.forEach((currentValue, index) => {
                var multaArgumento = new MultaArgumento();
                multaArgumento.Id = 0;
                multaArgumento.ArgumentoId = argumento.Id;
                multaArgumento.MultaId = currentValue.Id;

                multaArgumento.Mensagem = '';
                multaArgumento.NomePropriedade = '';

                // Cadastra novamente as multas selecionadas
                this.multaArgumentoService.AdicionarMultaArgumento(multaArgumento)
                  .subscribe((response: MultaArgumento) => {

                  }, (error) => console.error(error),
                    () => { })
              });

              this.ListagemArgumentos();
              this.router.navigate(
                ['/argumento']
              );

            }, (error) => console.error(error),
              () => { })

        }, (error) => console.error(error),
          () => { })

    }
    else {

      this.argumentoService.AdicionarArgumento(argumento)
        .subscribe((response: Argumento) => {

          this.selectedMulta.forEach((currentValue, index) => {

            var multaArgumento = new MultaArgumento();
            multaArgumento.Id = 0;
            multaArgumento.ArgumentoId = response.Id;
            multaArgumento.MultaId = currentValue.Id;

            multaArgumento.Mensagem = '';
            multaArgumento.NomePropriedade = '';

            //cadastra o veículo 
            this.multaArgumentoService.AdicionarMultaArgumento(multaArgumento)
              .subscribe((response: MultaArgumento) => {

              }, (error) => console.error(error),
                () => { })
          });

          this.argumentoForm.reset();

        }, (error) => console.error(error),
          () => { })
    }
  }

  ListarMulta() {

    this.MultaService.ListarMulta()
      .subscribe((response: Array<Multa>) => {

        this.listMulta = response;
        this.dropdownListMulta = this.listMulta;
      }
      )
  }

  // Converte anexo selecionado para Base64
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  // Anexo selecionado
  InputChange(event) {

    this.convertFile((event.target as HTMLInputElement).files?.[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }

  OnclickEdit(row) {

    this.loadCadastro(row);
    this.tipoTela = 2;

    this.router.navigate(
      ['/argumento'],
      { queryParams: { 'id': row['Id'], 'action': 'edit' } }
    );
  }

  OnclickDelete(row) {


    this.argumentoService.DeleteArgumento(row.Id)
      .subscribe((response: Argumento) => {

        this.ListagemArgumentos();
        this.router.navigate(
          ['/argumento']
        );

      }, (error) => console.error(error),
        () => { })
  }

  //#region Métodos dropdown  
  onItemSelect(item: any) {
    this.selectedMulta = [];
    this.selectedMulta.push(item);
  }

  onDeSelect(item: any) {
    this.selectedMulta = this.selectedMulta.filter((el) => el !== item);
    this.listMulta = new Array<Multa>();
  }

  onSelectAll(items: any) {
    this.selectedMulta = new Array<Multa>();
    items.forEach((currentValue, index) => {
      this.selectedMulta.push(currentValue);
    });
  }

  onDeSelectAll(item: any) {
    this.selectedMulta = new Array<Multa>();
  }
  //#endregion
}
