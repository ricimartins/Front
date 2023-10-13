import { Base } from "./Base";
import { Defesa } from "./Defesa";

export class Protocolo extends Base {
  Numero: number;
  Data: Date;
  Vencimento: Date;
  Status: number;
  Etapa: number;
  DefesaId: number;
  Defesa?: Defesa | null;
}