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

@Component({
  selector: 'argumento',
  templateUrl: './argumento.component.html',
  styleUrls: ['./argumento.component.scss']
})

export class ArgumentoComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public authService: AuthService, public argumentoService: ArgumentoService,
    public MultaService: MultaService, private router : Router, 
    private route: ActivatedRoute ) {}

  listMultas = new Array<SelectModel>();
  multaSelect = new SelectModel();

  argumentoForm : FormGroup;

  ngOnInit(){
    debugger          

    this.menuService.menuSelecionado = 9;
    
    this.argumentoForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          descricao: ['', [Validators.required]],
          multaSelect: ['', [Validators.required]],
          anexo: ['', [Validators.required]]
        }
      )
      this.ListagemArgumentos();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListArgumentos: Array<Argumento>;
  id: string;
  
  page: number = 1;
  config: any;
  paginacao: boolean = true;
  itemsPorPagina: number = 10
  base64Output: string;
  // Id selecionado para edição  
  rowId: number = 0;

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
    this.ListarMulta();
    this.argumentoForm.reset();
  }

  loadCadastro(row : any)
  {
    
    this.tipoTela = 2;
    this.ListarMulta();
    let multaSelect = new SelectModel();        

    this.argumentoService.ListarArgumentoById(row.Id)
      .subscribe((response: Array<Argumento>) => {
        this.rowId = row.Id;
        this.argumentoForm.controls["name"].setValue(row.Nome);
        this.argumentoForm.controls["descricao"].setValue(row.Descricao);
        multaSelect.id = row.Multa.Id;
        multaSelect.name = row.Multa.Nome;
        this.argumentoForm.controls["multaSelect"].setValue(multaSelect);
        this.argumentoForm.controls["anexo"].setValue(row.anexo);
                
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
    dadosForm()
    {
      return this.argumentoForm.controls;
    }

    enviar(){
      
      let action;
      
      this.route.queryParamMap
       .subscribe(params => {
             action = params.get('action');     
      });      

      var dados = this.dadosForm();      

      let item = new Argumento();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Descricao = dados["descricao"].value
      item.MultaId = parseInt(this.multaSelect.id)
      item.Anexo = this.base64Output;
      
      item.NomePropriedade = '';
      item.Mensagem = '';
      
      if (action === 'edit'){
        //Recupero o Id do registro que estão em edição
        item.Id = this.rowId;        
        
        this.argumentoService.AtualizarArgumento(item)
        .subscribe((response: Argumento) => {
          
          this.ListagemArgumentos();
          this.router.navigate(
            ['/argumento']
          );                      

        }, (error) => console.error(error),
          () => { })  

      }
      else{
        this.argumentoService.AdicionarArgumento(item)
        .subscribe((response: Argumento) => {
  
        this.argumentoForm.reset();                

        }, (error) => console.error(error),
          () => { })
      }           

    }  

    ListarMulta(){
    
      this.multaSelect = new SelectModel()
      this.MultaService.ListarMulta()
        .subscribe((response: Array<Multa>) => {
        
          var lisMulta = [];
          response.forEach(x => {
                var item = new SelectModel();
                item.id = x.Id.toString();
                item.name = x.Nome;                
                
                lisMulta.push(item);
          });

          this.listMultas = lisMulta;
      }         
      )
    }
    
    // Converte anexo selecionado para Base64
    convertFile(file : File) : Observable<string> {
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
    
    OnclickEdit(row){      
      
      this.loadCadastro(row);
      this.tipoTela = 2;      
      
      this.router.navigate(
        ['/argumento'],
        { queryParams: { 'id': row['Id'], 'action' : 'edit' } }
      );      
    }

    OnclickDelete(row){      
      
      
      this.argumentoService.DeleteArgumento(row.Id)
        .subscribe((response: Argumento) => {
          
          this.ListagemArgumentos();
          this.router.navigate(
            ['/argumento']
          );                      

        }, (error) => console.error(error),
          () => { })
    }    
}
