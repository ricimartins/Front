import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { OrgaoAutuador } from "../models/OrgaoAutuador";

@Injectable({
    providedIn : 'root'
})

export class OrgaoAutuadorService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarOrgaoAutuador(orgaoautuador:OrgaoAutuador)
    {
        debugger
        return this.httpClient.post<OrgaoAutuador> (`${this.baseUrl}/AdicionarOrgaoAutuador`,
            orgaoautuador);
    }

    ListaOrgaoAutuadorsUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListaOrgaoAutuadorsUsuario?emailUsuario=${emailUsuario}`);
    }

    CadastrarUsuarioNoOrgaoAutuador(IdOrgaoAutuador:number, emailUsuario:string)
    {
        return this.httpClient.post(`${this.baseUrl}/CadastrarUsuarioNoOrgaoAutuador?IdOrgaoAutuador=${IdOrgaoAutuador}&emailUsuario=${emailUsuario}`, null);
    }

    ListarOrgaoAutuador()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarOrgaoAutuador`);
    }

}