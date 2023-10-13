import { Base } from "./Base";
import { OrgaoAutuador } from "./OrgaoAutuador";

export class Multa extends Base{        
    Codigo: string;
    Descricao: string;
    OrgaoAutuadorId: number;
    OrgaoAutuador: OrgaoAutuador;    
}