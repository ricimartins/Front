import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment";
import { Defesa } from "../models/Defesa";

@Injectable({
    providedIn: 'root'
})

export class DefesaService {
    constructor(private httpClient: HttpClient) {

    }

    private readonly baseUrl = environment["endPoint"];

    AdicionarDefesa(defesa: Defesa) {
        return this.httpClient.post<Defesa>(`${this.baseUrl}/AdicionarDefesa`,
            defesa);
    }

    ListarDefesasUsuario(emailUsuario: string) {
        return this.httpClient.get(`${this.baseUrl}/ListarDefesasUsuario?emailUsuario=${emailUsuario}`);
    }

    ListarDefesa() {
        return this.httpClient.get(`${this.baseUrl}/ListarDefesa`);
    }

    ObterDefesa(id: number) {
        return this.httpClient.get(`${this.baseUrl}/ObterDefesa?Id=${id}`);
    }

    AtualizarDefesa(defesa: Defesa) {
        return this.httpClient.put<Defesa>(`${this.baseUrl}/AtualizarDefesa`,
            defesa);
    }
    DeleteDefesa(id: number) {
        return this.httpClient.delete(`${this.baseUrl}/DeleteDefesa?Id=${id}`);
    }

}