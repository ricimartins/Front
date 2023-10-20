import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { ArgumentoDefesa } from "../models/ArgumentoDefesa";

@Injectable({
    providedIn : 'root'
})

export class ArgumentoDefesaService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarArgumentoDefesa(argumentoDefesa:ArgumentoDefesa)
    {
        return this.httpClient.post<ArgumentoDefesa> (`${this.baseUrl}/AdicionarArgumentoDefesa`,
            argumentoDefesa);
    }    

    ListarArgumentoDefesa(defesaId)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarArgumentoDefesa=${defesaId}`);
    }    

    AtualizarArgumentoDefesa(argumentoDefesa:ArgumentoDefesa)
    {
        return this.httpClient.put<ArgumentoDefesa> (`${this.baseUrl}/AtualizarArgumentoDefesa`,
            argumentoDefesa);
    }

    DeleteArgumentoDefesa(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteArgumentoDefesa?Id=${id}`);
    }    

}