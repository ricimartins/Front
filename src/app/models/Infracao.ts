import { Base } from "./Base";
import { Cliente } from "./Cliente";
import { Funcionario } from "./Funcionario";
import { Multa } from "./Multa";
import { Veiculo } from "./Veiculo";

export class Infracao extends Base
{    
    Data: string;
    Pontuacao: number;
    VeiculoId: number;
    MultaId: number;
    ClienteId: number;
    FuncionarioId: number;
    
    Veiculo: Veiculo;
    Multa: Multa;
    Cliente: Cliente;
    Funcionario: Funcionario;
        
}