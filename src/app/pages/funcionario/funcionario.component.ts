import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funcionario } from 'src/app/models/Funcionario';
import { Franquia } from 'src/app/models/Franquia';
import { AuthService } from 'src/app/services/auth.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
//import { SelectModel } from 'src/app/models/selectModel';
import { FranquiaFuncionarioService } from 'src/app/services/franquiafuncionario.service';
import { FranquiaFuncionario } from 'src/app/models/FranquiaFuncionario';

@Component({
  selector: 'funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss'],    
})
export class FuncionarioComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public franquiaService: FranquiaService, public authService: AuthService,
    public funcionarioService: FuncionarioService, public franquiaFuncionarioService: FranquiaFuncionarioService,
    private router : Router, private route: ActivatedRoute, public dialog: MatDialog) {}

  
  //#region Variáveis globais  
  funcionarioForm : FormGroup;
  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListFuncionarios: Array<Funcionario>;
  tableListFranquia: Array<Franquia>;
  id: string;

  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  rowId : number = 0;
  dropdownListFranquia : Array<Franquia>;
  selectedItemsFranquia : Array<Franquia>;
  dropdownSettingsFranquia = {};
  //#endregion

  ngOnInit(){    
    this.menuService.menuSelecionado = 3;

    this.dropdownSettingsFranquia = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Procurar",
      noDataAvailablePlaceholderText: "Franquia não cadastrados"
    };
    
    this.funcionarioForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          telefone: ['', [Validators.required]],
          email: ['', [Validators.required]],
          franquiaSelect:['', [Validators.required]],
          senha:['', [Validators.required]],
          cpf:['', [Validators.required]],
          numeroOAB:['', [Validators.required]],
          rg:['', [Validators.required]],
          estadoCivil:['', [Validators.required]],
          nacionalidade:['', [Validators.required]],
          endereco:['', [Validators.required]]
        }
      )
      this.ListagemFuncionarios();        
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

  cadastro()
  {
    this.tipoTela = 2;
    this.ListarFranquia();
    this.funcionarioForm.reset();
    this.selectedItemsFranquia = new Array<Franquia>();
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
  
  ListagemFuncionarios() {
    this.tipoTela = 1;
    this.router.navigate(
      ['/funcionario']
    );
    
    this.funcionarioService.ListarFuncionario()
      .subscribe((response: Array<Funcionario>) => {

        this.tableListFuncionarios = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.funcionarioForm.controls;
    }

    enviar(){
      
      let action;
      
      this.route.queryParamMap
       .subscribe(params => {
             action = params.get('action');     
      });      

      var dados = this.dadosForm();      
      let funcionario = new Funcionario();
      funcionario.Nome = dados["name"].value;
      funcionario.Id = 0;
      funcionario.Telefone = dados["telefone"].value;      
      funcionario.Email = dados["email"].value;      
      funcionario.CPF = dados["cpf"].value;
      funcionario.NumeroOAB = dados["numeroOAB"].value;
      funcionario.RG = dados["rg"].value;
      funcionario.Nacionalidade = dados["nacionalidade"].value;
      funcionario.EstadoCivil = dados["estadoCivil"].value;      
      funcionario.Endereco = dados["endereco"].value;      

      funcionario.NomePropriedade = '';
      funcionario.Mensagem = '';

      if (action === 'edit'){
        //Recupero o Id do registro que estão em edição
        funcionario.Id = this.rowId;        
        
        this.funcionarioService.AtualizarFuncionario(funcionario)
        .subscribe((response: Funcionario) => {

          // Busco as franquias do Funcionário para cadastrar novamente
          this.franquiaFuncionarioService.ObterFranquiaFuncionario(funcionario.Id)
            .subscribe((response: Array<FranquiaFuncionario>) => {              

              //Remove todas as franquias atuais
              response.forEach((currentValue, index) => {
                this.franquiaFuncionarioService.DeleteFranquiaFuncionario(currentValue.Id)
                .subscribe((response: Array<FranquiaFuncionario>) => {                                                    
                }, (error) => console.error(error),
                () => { })                                
              });

              this.selectedItemsFranquia.forEach((currentValue, index) => {
              var franquiaFuncionario = new FranquiaFuncionario();
              franquiaFuncionario.Id = 0;
              franquiaFuncionario.FranquiaId = currentValue.Id
              franquiaFuncionario.FuncionarioId = funcionario.Id;              
              franquiaFuncionario.Mensagem = '';
              franquiaFuncionario.NomePropriedade = '';       
              
              // Cadastra novamente as franquias do Funcionario
              this.franquiaFuncionarioService.AdicionarFranquiaFuncionario(franquiaFuncionario)
              .subscribe((response: FranquiaFuncionario) => {                                

              }, (error) => console.error(error),
                () => { })

              });

              this.selectedItemsFranquia = new Array<Franquia>();
              response.forEach((currentValue, index) => {
                this.selectedItemsFranquia.push(currentValue.Franquia);      
              });

            }, (error) => console.error(error),
            () => { })

          alert('Alterado com sucesso!')
          this.ListagemFuncionarios();                                

        }, (error) => console.error(error),
          () => { })  
      }
      else{
        this.funcionarioService.AdicionarFuncionario(funcionario)
          .subscribe((response: Funcionario) => {                              
                
            this.selectedItemsFranquia.forEach((currentValue, index) => {
              
              var franquiaFuncionario = new FranquiaFuncionario();
              franquiaFuncionario.Id = 0;
              franquiaFuncionario.FranquiaId = currentValue.Id
              franquiaFuncionario.FuncionarioId = response.Id;              
              franquiaFuncionario.Mensagem = '';
              franquiaFuncionario.NomePropriedade = '';       

              //Cadastra as franquias
              this.franquiaFuncionarioService.AdicionarFranquiaFuncionario(franquiaFuncionario)
              .subscribe((response: FranquiaFuncionario) => {                                

              }, (error) => console.error(error),
                () => { })
          });            
        
          this.funcionarioForm.reset();                
          alert('Cadastrado com sucesso!')  

        }, (error) => console.error(error),
          () => { })

      }
    }    

    ListarFranquia(){
      
      this.franquiaService.ListarFranquia()
        .subscribe((response: Array<Franquia>) => {
        
          this.tableListFranquia = response;
          this.dropdownListFranquia = this.tableListFranquia
      }         
      )
    }

    //#region Métodos de exclusão e alteração
    OnclickEdit(row){            
      this.loadCadastro(row);
      this.tipoTela = 2;      
      this.selectedItemsFranquia = new Array<Franquia>();
      
      this.router.navigate(
        ['/funcionario'],
        { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
      );      
    }

    OnclickDelete(row){                  
      this.funcionarioService.DeleteFuncionario(row.Id)
        .subscribe((response: Funcionario) => {
          alert('Excluído com sucesso!')
          this.ListagemFuncionarios();          

        }, (error) => console.error(error),
          () => { })
    }  

    loadCadastro(row : any){
    
      this.tipoTela = 2;
      this.ListarFranquia();
  
      this.funcionarioService.ListarFuncionarioById(row.Id)
        .subscribe((response: Array<Funcionario>) => {
          this.rowId = row.Id;
          this.funcionarioForm.controls["name"].setValue(row.Nome);
          this.funcionarioForm.controls["telefone"].setValue(row.Telefone);
          this.funcionarioForm.controls["email"].setValue(row.Email);
          this.funcionarioForm.controls["cpf"].setValue(row.CPF);
          this.funcionarioForm.controls["numeroOAB"].setValue(row.NumeroOAB);
          this.funcionarioForm.controls["rg"].setValue(row.RG);
          this.funcionarioForm.controls["nacionalidade"].setValue(row.Nacionalidade);
          this.funcionarioForm.controls["estadoCivil"].setValue(row.EstadoCivil);
          this.funcionarioForm.controls["endereco"].setValue(row.Endereco);
          
          //Recupera as franquias do funcionario
          this.franquiaFuncionarioService.ObterFranquiaFuncionario(row.Id)
            .subscribe((response: Array<FranquiaFuncionario>) => {
              
              this.selectedItemsFranquia = new Array<Franquia>();
              response.forEach((currentValue, index) => {
                this.selectedItemsFranquia.push(currentValue.Franquia);      
              });

            }, (error) => console.error(error),
            () => { })          
                  
        }, (error) => console.error(error),
          () => { })              
      }
    //#endregion      

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(DialogAnimationsDialog, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
    
    //#region Métodos dropdown
    onItemSelect(item: any) {      
      //this.selectedItemsFranquia.push(item);      
    }
    onSelectAll(items: any) {   
      this.selectedItemsFranquia = new Array<Franquia>();
      items.forEach((currentValue, index) => {
        this.selectedItemsFranquia.push(currentValue);      
      });
    }  

    onDeSelect(item: any) {      
      this.selectedItemsFranquia = this.selectedItemsFranquia.filter((el) => el !== item);
    }

    onDeSelectAll(item: any) {      
      this.selectedItemsFranquia = new Array<Franquia>();
    }
    //#endregion
    
}

export class DialogAnimationsDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsDialog>) {}
}
