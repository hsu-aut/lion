import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataFormatHandler, FormatDescription } from '@shared/models/DataFormats';
import { MessagesService } from '@shared-services/messages.service';
import { GraphOperationsService } from '../../../../shared/services/backEnd/graphOperations.service';
import { GraphDto } from '@shared/models/graphs/GraphDto';

@Component({
    selector: 'app-up-and-downloads',
    templateUrl: './up-and-downloads.component.html',
    styleUrls: ['./up-and-downloads.component.scss']
})
export class UpAndDownloadsComponent implements OnInit {

  // input variables from parent component
  @Input() graphList: Array<GraphDto>;

  // util variables
  dataFormats = DataFormatHandler.getFormatDescriptions();
  fileToUpload: File;

  //forms
  downloadOption = this.fb.group({
      graph: ["", Validators.required],
      dataFormat: this.fb.control<FormatDescription>(null,  Validators.required),
  })
  uploadOption = this.fb.group({
      graph: ["", Validators.required],
  })
  
  constructor(
      private fb: FormBuilder,
      private graphService: GraphOperationsService,
      private messageService: MessagesService
  ) { }

  ngOnInit(): void {
      return;
  }

  setUploadFile(eventTarget: HTMLInputElement): void {
      this.fileToUpload = eventTarget.files.item(0);
      return;
  }

  /**
   *
   */
  uploadGraph(): void {
      const graphIri = this.uploadOption.get('graph').value;
      this.graphService.addTriplesToNamedGraph(this.fileToUpload, graphIri).subscribe();
      this.messageService.warn('Ups!', 'It seems like you discovered some WIP');
  }


  /**
 * Download contents of a graph in a certain data format
 * @param graph IRI of the graph to export content from
 * @param dataFormatName  Data format used when exporting contents
 */
  downloadGraph(): void {
      const graphIri = this.downloadOption.get('graph').value;
      const dataFormat = this.downloadOption.get('dataFormat').value;

      if (this.downloadOption.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...');
          return;
      }

      this.graphService.getTriplesOfNamedGraph(graphIri, dataFormat);
  }


}
