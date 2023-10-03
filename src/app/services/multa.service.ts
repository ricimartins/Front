import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Multa } from "../models/Multa";

@Injectable({
    providedIn : 'root'
})

export class MultaService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarMulta(multa:Multa)
    {
        return this.httpClient.post<Multa> (`${this.baseUrl}/AdicionarMulta`,
            multa);
    }

    ListarMultasUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarMultasUsuario?emailUsuario=${emailUsuario}`);
    }    

    ListarMulta()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarMulta`);
    }

}