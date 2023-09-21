import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { SistemaFinanceiro } from "../models/SistemaFinanceiro";

@Injectable({
    providedIn : 'root'
})

export class SistemaService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarSistemaFinanceiro(sistemaFinanceiro:SistemaFinanceiro)
    {
        debugger
        return this.httpClient.post<SistemaFinanceiro> (`${this.baseUrl}/AdicionarSistemaFinanceiro`,
            sistemaFinanceiro);
    }

    ListaSistemasUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListaSistemasUsuario?emailUsuario=${emailUsuario}`);
    }

    CadastrarUsuarioNoSistema(IdSistema:number, emailUsuario:string)
    {
        return this.httpClient.post(`${this.baseUrl}/CadastrarUsuarioNoSistema?IdSistema=${IdSistema}&emailUsuario=${emailUsuario}`, null);
    }

}