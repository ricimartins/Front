import { Base } from "./Base";

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