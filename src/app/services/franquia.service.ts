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

    DeleteFranquia(id: number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteFranquia?id=${id}`);
    }

    ObterFranquia(id: number){
        return this.httpClient.get(`${this.baseUrl}/ObterFranquia?id=${id}`);
    }

    AtualizarFranquia(franquia: Franquia){
        return this.httpClient.put<Franquia>(`${this.baseUrl}/AtualizarFranquia`, franquia);
    }

}