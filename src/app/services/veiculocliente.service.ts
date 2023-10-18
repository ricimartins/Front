import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { VeiculoCliente } from "../models/VeiculoCliente";

@Injectable({
    providedIn : 'root'
})

export class VeiculoClienteService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarVeiculoCliente(veiculoCliente:VeiculoCliente)
    {
        return this.httpClient.post<VeiculoCliente> (`${this.baseUrl}/AdicionarVeiculoCliente`,
            veiculoCliente);
    }    

    ListarVeiculoCliente()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculo`);
    }

    ListarVeiculoClienteById(id : number)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarVeiculoById?id=${id}`);
    }

    AtualizarVeiculoCliente(veiculoCliente:VeiculoCliente)
    {
        return this.httpClient.put<VeiculoCliente> (`${this.baseUrl}/AtualizarVeiculo`,
            veiculoCliente);
    }

    DeleteVeiculoCliente(id:number)
    {
        return this.httpClient.delete(`${this.baseUrl}/DeleteVeiculoCliente?Id=${id}`);
    }

    ObterVeiculoCliente(clienteId: number){
        return this.httpClient.get(`${this.baseUrl}/ObterVeiculoCliente?clienteId=${clienteId}`);
    }

}