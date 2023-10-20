import { Component, Input } from '@angular/core';
import { Packer } from "docx";
import { saveAs } from 'file-saver';
import { experiences, education, skills, achievements } from "./cv-data";
import { DocumentCreator } from "./cv-generator";
import { DocumentCreatorNew } from './cv-generator_new';
import { TemplateDefesa } from 'src/app/models/TemplateDefesa';


@Component({
  selector: 'docx-generator',
  templateUrl: './docx-generator.component.html',
  styleUrls: ['./docx-generator.component.scss']
})
export class DocxGeneratorComponent {
  name = "Gerador de Documento";
  @Input () dados : any;

  public download(): void {

    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([
    //   experiences,
    //   education,
    //   skills,
    //   achievements
    // ]);

    const documentCreator = new DocumentCreatorNew();
    const doc = documentCreator.create([this.dados.Autoridade, this.dados.Assunto, this.dados.Cliente, this.dados.Argumento]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }

}
