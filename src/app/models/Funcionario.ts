import { Base } from "./Base";
import { Franquia } from "./Franquia";

export class Funcionario extends Base{
    Telefone: string;
    Email: string;
    FranquiaId: number;
    Franquia: Franquia;
}