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

    ListarFuncionarioEmail(email:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFuncionarioEmail?email=${email}`);
    }    

    ListarFuncionario()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFuncionario`);
    }

}