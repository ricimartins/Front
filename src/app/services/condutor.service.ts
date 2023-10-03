import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Condutor } from "../models/Condutor";

@Injectable({
    providedIn : 'root'
})

export class CondutorService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarCondutor(condutor:Condutor)
    {
        return this.httpClient.post<Condutor> (`${this.baseUrl}/AdicionarCondutor`,
            condutor);
    }

    ListarCondutorsUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarCondutorsUsuario?emailUsuario=${emailUsuario}`);
    }    

    ListarCondutor()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarCondutor`);
    }

}