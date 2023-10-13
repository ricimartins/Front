import { Base } from "./Base";
import { Franquia } from "./Franquia";
import { Funcionario } from "./Funcionario";

export class FranquiaFuncionario extends Base
{
  FranquiaId: number;
  FuncionarioId: number;

  Funcionario: Funcionario;
  Franquia: Franquia;
  
}

