import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Cliente } from "../models/Cliente";

@Injectable({
    providedIn : 'root'
})

export class ClienteService
{
    constructor(private httpClient : HttpClient)
    {

    }

    private readonly baseUrl = environment["endPoint"];
    
    AdicionarCliente(cliente:Cliente)
    {
        return this.httpClient.post<Cliente> (`${this.baseUrl}/AdicionarCliente`,
            cliente);
    }

    ListarClientesUsuario(emailUsuario:string)
    {
        return this.httpClient.get(`${this.baseUrl}/ListarClientesUsuario?emailUsuario=${emailUsuario}`);
    }    

    ListarCliente()
    {
        return this.httpClient.get(`${this.baseUrl}/ListarCliente`);
    }

}