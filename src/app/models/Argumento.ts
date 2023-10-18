import { Base } from "./Base";
import { Multa } from "./Multa";

export class Argumento extends Base{    
    Descricao: string;
    Detalhe: string;
    MultaId: number;
    Multa: Multa;
    Anexo: string;
}