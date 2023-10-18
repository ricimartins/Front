import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Argumento } from "../models/Argumento";

@Injectable({
    providedIn : 'root'
})

export class ArgumentoService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarArgumento(argumento:Argumento)
    {
        return this.httpClient.post<Argumento> (`${this.baseUrl}/AdicionarArgumento`,
            argumento);
    }

    ListarArgumentosUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarArgumentosUsuario?emailUsuario=${emailUsuario}`);
    }    

    ListarArgumento()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarArgumento`);
    }

    ObterArgumento(id:number)
    {
        return this.httpClient.get(`${this.baseUrl}/ObterArgumento?Id=${id}`);
    }

    AtualizarArgumento(argumento:Argumento)
    {
        return this.httpClient.put<Argumento> (`${this.baseUrl}/AtualizarArgumento`,
            argumento);
    }

    DeleteArgumento(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteArgumento?Id=${id}`);
    }

}