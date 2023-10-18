import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { MultaArgumento } from "../models/MultaArgumento";

@Injectable({
    providedIn : 'root'
})

export class MultaArgumentoService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarMultaArgumento(multaArgumento:MultaArgumento)
    {
        return this.httpClient.post<MultaArgumento> (`${this.baseUrl}/AdicionarMultaArgumento`,
            multaArgumento);
    }    

    ListarMultaArgumento()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarMultaArgumento`);
    }    

    AtualizarMultaArgumento(multaArgumento:MultaArgumento)
    {
        return this.httpClient.put<MultaArgumento> (`${this.baseUrl}/AtualizarMultaArgumento`,
            multaArgumento);
    }

    DeleteMultaArgumento(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteMultaArgumento?Id=${id}`);
    }

    ListarByArgumento(argumentoId: number){
        return this.httpClient.get(`${this.baseUrl}/ListarByArgumento?ArgumentoId=${argumentoId}`);
    }

    ListarByMulta(multaId: number){
        return this.httpClient.get(`${this.baseUrl}/ListarByMulta?MultaId=${multaId}`);
    }

}