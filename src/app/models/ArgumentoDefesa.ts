import { Argumento } from "./Argumento";
import { Base } from "./Base";
import { Defesa } from "./Defesa";

export class ArgumentoDefesa extends Base
{
    DefesaId: number;
    ArgumentoId: number;
    Argumento: Argumento;
    Defesa: Defesa;
}