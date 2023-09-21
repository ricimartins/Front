import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Despesa } from "../models/Despesa";

@Injectable({
    providedIn : 'root'
})

export class DespesaService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarDespesa(despesa:Despesa)
    {
        return this.httpClient.post<Despesa> (`${this.baseUrl}/AdicionarDespesa`,
            despesa);
    }

    ListarDespesasUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarDespesasUsuario?emailUsuario=${emailUsuario}`);
    }    

}