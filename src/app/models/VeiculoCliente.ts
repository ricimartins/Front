import { Base } from "./Base";
import { Cliente } from "./Cliente";
import { Veiculo } from "./Veiculo";

export class VeiculoCliente extends Base
{
    ClienteId: number;
    VeiculoId: number;
    Cliente: Cliente;
    Veiculo: Veiculo;
}