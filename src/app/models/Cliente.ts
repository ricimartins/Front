import { Base } from "./Base";
import { Franquia } from "./Franquia";

export class Cliente extends Base
{
    Documento: string;
    TipoDocumento: string;
    Telefone: string;
    Email: string;
    Endereco: string;
    DataNascimento: string;
    FranquiaId: number;
    Franquia : Franquia;    
}