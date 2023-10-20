import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Funcionario } from "../models/Funcionario";

@Injectable({
    providedIn : 'root'
})

export class FuncionarioService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarFuncionario(funcionario:Funcionario)
    {
        return this.httpClient.post<Funcionario> (`${this.baseUrl}/AdicionarFuncionario`,
            funcionario);
    }

    AtualizarFuncionario(funcionario:Funcionario)
    {
        return this.httpClient.put<Funcionario> (`${this.baseUrl}/AtualizarFuncionario`,
            funcionario);
    }

    ListarFuncionarioEmail(email:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFuncionarioEmail?email=${email}`);
    }    

    ListarFuncionario()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFuncionario`);
    }

    ListarFuncionarioById(id : number)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFuncionarioById?id=${id}`);
    }

    DeleteFuncionario(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteFuncionario?Id=${id}`);
    }         
}