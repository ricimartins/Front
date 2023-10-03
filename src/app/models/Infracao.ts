import { Base } from "./Base";
import { Condutor } from "./Condutor";
import { Multa } from "./Multa";
import { Veiculo } from "./Veiculo";

export class Infracao extends Base
{    
    Data: string;
    Pontuacao: number;
    VeiculoId: number;
    MultaId: number;
    CondutorId: number;
    Veiculo: Veiculo;
    Multa: Multa;
    Condutor: Condutor;    
}