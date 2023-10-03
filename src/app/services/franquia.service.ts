import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Franquia } from "../models/Franquia";

@Injectable({
    providedIn : 'root'
})

export class FranquiaService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarFranquia(franquia:Franquia)
    {
        debugger
        return this.httpClient.post<Franquia> (`${this.baseUrl}/AdicionarFranquia`,
            franquia);
    }

    ListaFranquiasUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListaFranquiasUsuario?emailUsuario=${emailUsuario}`);
    }

    CadastrarUsuarioNoFranquia(IdFranquia:number, emailUsuario:string)
    {
        return this.httpClient.post(`${this.baseUrl}/CadastrarUsuarioNoFranquia?IdFranquia=${IdFranquia}&emailUsuario=${emailUsuario}`, null);
    }

    ListarFranquia()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarFranquia`);
    }

}