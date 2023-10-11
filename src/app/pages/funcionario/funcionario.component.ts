import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funcionario } from 'src/app/models/Funcionario';
import { Franquia } from 'src/app/models/Franquia';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss'],    
})
export class FuncionarioComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public franquiaService: FranquiaService, public authService: AuthService,
    public funcionarioService: FuncionarioService, private router : Router, 
    private route: ActivatedRoute, public dialog: MatDialog) {}

listFranquias = new Array<SelectModel>();
franquiaSelect = new SelectModel();

  funcionarioForm : FormGroup;

  ngOnInit(){
    debugger
    this.menuService.menuSelecionado = 3;
    
    this.funcionarioForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          telefone: ['', [Validators.required]],
          email: ['', [Validators.required]],
          franquiaSelect:['', [Validators.required]]
        }
      )
      this.ListagemFuncionarios();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListFuncionarios: Array<Funcionario>;
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
    this.ListarFranquia();
    this.funcionarioForm.reset();
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
      
      var dados = this.dadosForm();      

      let item = new Funcionario();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Telefone = dados["telefone"].value;
      item.Email = dados["email"].value;
      item.FranquiaId = parseInt(this.franquiaSelect.id);      
      item.NomePropriedade = '';
      item.Mensagem = '';

      this.funcionarioService.AdicionarFuncionario(item)
        .subscribe((response: Funcionario) => {
  
      this.funcionarioForm.reset();                

      }, (error) => console.error(error),
        () => { })

      }  

    ListarFranquia(){
      
      this.franquiaService.ListarFranquia()
        .subscribe((response: Array<Franquia>) => {
        
          var lisFranquia = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;
                
                lisFranquia.push(item);
          });

          this.listFranquias = lisFranquia;
      }         
      )
    }

    OnclickEdit(row){      
      
      //this.loadCadastro(row);
      this.tipoTela = 2;      
      
      this.router.navigate(
        ['/funcionario'],
        { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
      );      
    }

    OnclickDelete(row){      
      
      
      // this.argumentoService.DeleteArgumento(row.Id)
      //   .subscribe((response: Argumento) => {
          
      //     this.ListagemArgumentos();
      //     this.router.navigate(
      //       ['/argumento']
      //     );                      

      //   }, (error) => console.error(error),
      //     () => { })
    }    

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(DialogAnimationsDialog, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }        
}

export class DialogAnimationsDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsDialog>) {}
}
