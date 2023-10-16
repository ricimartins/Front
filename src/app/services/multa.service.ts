import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Multa } from "../models/Multa";

@Injectable({
    providedIn: 'root'
})

export class MultaService {
    constructor(private httpClient: HttpClient) {

    }

    private readonly baseUrl = environment["endPoint"];

    AdicionarMulta(multa: Multa) {
        return this.httpClient.post<Multa>(`${this.baseUrl}/AdicionarMulta`,
            multa);
    }

    ListarMultasUsuario(emailUsuario: string) {
        return this.httpClient.get(`${this.baseUrl}/ListarMultasUsuario?emailUsuario=${emailUsuario}`);
    }

    ListarMulta() {
        return this.httpClient.get(`${this.baseUrl}/ListarMulta`);
    }

    ObterMulta(id: number) {
        return this.httpClient.get(`${this.baseUrl}/ObterMulta?Id=${id}`);
    }

    AtualizarMulta(multa: Multa) {
        return this.httpClient.put<Multa>(`${this.baseUrl}/AtualizarMulta`,
            multa);
    }
    DeleteMulta(id: number) {
        return this.httpClient.delete(`${this.baseUrl}/DeleteMulta?Id=${id}`);
    }

}