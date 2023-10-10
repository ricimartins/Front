import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Veiculo } from "../models/Veiculo";

@Injectable({
    providedIn : 'root'
})

export class VeiculoService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarVeiculo(veiculo:Veiculo)
    {
        return this.httpClient.post<Veiculo> (`${this.baseUrl}/AdicionarVeiculo`,
            veiculo);
    }

    ListarVeiculosUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculosUsuario?emailUsuario=${emailUsuario}`);
    }    

    ListarVeiculo()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculo`);
    }

    ListarVeiculoById(id : number)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculoById?id=${id}`);
    }

}