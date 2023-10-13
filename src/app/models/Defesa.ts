import { Base } from "./Base";
import { Funcionario } from "./Funcionario";
import { Infracao } from "./Infracao";

export class Defesa extends Base
{
    Data: Date;
    InfracaoId: number;
    FuncionarioId: number;

    Infracao: Infracao;
    Funcionario: Funcionario;
}