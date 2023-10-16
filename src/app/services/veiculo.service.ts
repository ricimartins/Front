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

    ListarVeiculoCliente(clienteId : number)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculoCliente?clienteId=${clienteId}`);
    }    

    ListarVeiculo()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculo`);
    }

    ListarVeiculoById(id : number)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculoById?id=${id}`);
    }

    AtualizarVeiculo(veiculo:Veiculo)
    {
        return this.httpClient.put<Veiculo> (`${this.baseUrl}/AtualizarVeiculo`,
            veiculo);
    }

    DeleteVeiculo(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteVeiculo?Id=${id}`);
    }

}