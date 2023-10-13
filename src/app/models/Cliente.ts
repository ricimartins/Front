import { Base } from "./Base";
import { Franquia } from "./Franquia";

export class Cliente extends Base
{
    Nome: string;
    CPF: string;
    Telefone: string;
    Email: string;
    Endereco: string;
    DataNascimento: Date;    
    NumeroCNH: string;
    ValidadeCNH: Date;
}