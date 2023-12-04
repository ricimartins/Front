import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { FranquiaFuncionario } from "../models/FranquiaFuncionario";

@Injectable({
    providedIn : 'root'
})

export class FranquiaFuncionarioService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarFranquiaFuncionario(franquiafuncionario:FranquiaFuncionario)
    {        
        return this.httpClient.post<FranquiaFuncionario> (`${this.baseUrl}/AdicionarFranquiaFuncionario`,
            franquiafuncionario);
    }

    ListaFranquiaFuncionarioByEmail(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListaFranquiaFuncionarioByEmail?email=${emailUsuario}`);
    }

    CadastrarUsuarioNoFranquiaFuncionario(IdFranquiaFuncionario:number, emailUsuario:string)
    {
        return this.httpClient.post(`${this.baseUrl}/CadastrarUsuarioNoFranquiaFuncionario?IdFranquiaFuncionario=${IdFranquiaFuncionario}&emailUsuario=${emailUsuario}`, null);
    }

    ListarFranquiaFuncionario()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFranquiaFuncionario`);
    }

    DeleteFranquiaFuncionario(id: number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteFranquiaFuncionario?id=${id}`);
    }

    ObterFranquiaFuncionario(funcionarioId: number){
        return this.httpClient.get(`${this.baseUrl}/ObterFranquiaFuncionario?funcionarioId=${funcionarioId}`);
    }

    AtualizarFranquiaFuncionario(franquiafuncionario: FranquiaFuncionario){
        return this.httpClient.put<FranquiaFuncionario>(`${this.baseUrl}/AtualizarFranquiaFuncionario`, franquiafuncionario);
    }

}