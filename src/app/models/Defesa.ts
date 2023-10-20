import { Base } from "./Base";
import { Cliente } from "./Cliente";
import { Infracao } from "./Infracao";

export class Defesa extends Base
{
    Data: Date;
    Numero: String;
    InfracaoId: number;

    Infracao: Infracao;
    Cliente: Cliente;
}