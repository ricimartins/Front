export class TemplateDefesa{
    Autoridade: string;
    Assunto: string;
    Cliente: string;
    Argumento :  Array<TemplateArgumento>;
}

export class TemplateArgumento{
    Descricao:string;
    Detalhe:string;
}