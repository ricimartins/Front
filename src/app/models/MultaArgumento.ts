import { Argumento } from "./Argumento";
import { Base } from "./Base";
import { Multa } from "./Multa";

export class MultaArgumento extends Base
{
    MultaId: number;
    ArgumentoId: number;
    Argumento: Argumento;
    Multa: Multa;
}