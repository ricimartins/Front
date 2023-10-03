import { Base } from "./Base";
import { Cliente } from "./Cliente";

export class Veiculo extends Base
{
    Placa: string;
    Renavam: string;
    Marca: string;
    Modelo: string;
    Ano: number;
    Cor: string;
    Chassi: string;
    ClienteId: number;
    Cliente: Cliente;
}