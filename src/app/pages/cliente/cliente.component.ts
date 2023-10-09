import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/Cliente';
import { Franquia } from 'src/app/models/Franquia';
import { SelectModel } from 'src/app/models/selectModel';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MenuService } from 'src/app/services/menu.service';
import { FranquiaService } from 'src/app/services/franquia.service';

@Component({
  selector: 'cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder,
    public franquiaService: FranquiaService, public authService: AuthService,
    public clienteService: ClienteService) {}

listFranquias = new Array<SelectModel>();
franquiaSelect = new SelectModel();

  clienteForm : FormGroup;

  ngOnInit(){
    debugger
    this.menuService.menuSelecionado = 4;
    
    this.clienteForm = this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          telefone: ['', [Validators.required]],
          email: ['', [Validators.required]],
          tipoDocumento: ['', [Validators.required]],
          documento: ['', [Validators.required]],
          endereco: ['', [Validators.required]],
          dataNascimento: ['', [Validators.required]],
          franquiaSelect:['', [Validators.required]]
        }
      )
      this.ListagemClientes();        
      this.configpag();
    }

  tipoTela: number = 1;// 1 listagem, 2 cadastro, 3 edição
  tableListClientes: Array<Cliente>;
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
    this.clienteForm.reset();
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
  
  ListagemClientes() {
    this.tipoTela = 1;
    
    this.clienteService.ListarCliente()
      .subscribe((response: Array<Cliente>) => {

        this.tableListClientes = response;

      }, (error) => console.error(error),
        () => { })
  }

    // Pega os dados do form 
    dadosForm()
    {
      return this.clienteForm.controls;
    }

    enviar(){
      
      var dados = this.dadosForm();      

      let item = new Cliente();
      item.Nome = dados["name"].value;
      item.Id = 0;
      item.Telefone = dados["telefone"].value;
      item.Email = dados["email"].value;
      item.FranquiaId = parseInt(this.franquiaSelect.id);      
      item.DataNascimento = dados["dataNascimento"].value;      
      item.TipoDocumento = dados["tipoDocumento"].value;
      item.Documento = dados["documento"].value;      
      item.Endereco = dados["endereco"].value;      
      
      item.NomePropriedade = '';
      item.Mensagem = '';
      

      this.clienteService.AdicionarCliente(item)
        .subscribe((response: Cliente) => {
  
      this.clienteForm.reset();                

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
}
