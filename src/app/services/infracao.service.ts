import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Infracao } from "../models/Infracao";

@Injectable({
    providedIn : 'root'
})

export class InfracaoService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarInfracao(infracao:Infracao)
    {
        return this.httpClient.post<Infracao> (`${this.baseUrl}/AdicionarInfracao`,
            infracao);
    }

    ListarInfracaoEmail(email:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarInfracaoEmail?email=${email}`);
    }    

    ListarInfracao()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarInfracao`);
    }

}