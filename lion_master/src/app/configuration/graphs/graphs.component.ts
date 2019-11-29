import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { DataDescription, FormatDescription } from '../../modelling/utils/formats';
import { MessagesService } from '../../shared/services/messages.service';

import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {
  // util variables
  keys = Object.keys;
  dataDescription = new DataDescription();
  dataFormats = this.dataDescription.ContentTypes;

  // stats
  graphsCount: number;

  // namespace config
  graphList: Array<string>;
  activeGraph: string;

  // forms
  graphSetOption = this.fb.control('', Validators.required);
  graphDeleteOption = this.fb.control('', Validators.required);
  graphDeleteTriplesOption = this.fb.control('', Validators.required);
  newGraph = this.fb.control('', [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('([-a-zA-Z0-9()@:%_\+.~#?&//=]){1,}')]);
  downloadOption = this.fb.group({
    graph: [undefined, Validators.required],
    dataFormat: [undefined, Validators.required],
  })
  uploadOption = this.fb.group({
    graph: [undefined, Validators.required],
    dataFormat: [undefined, Validators.required],
  })

  constructor(
    private fb: FormBuilder,

    private graphOperation: GraphOperationsService,
    private messageService: MessagesService

  ) { }

  ngOnInit() {
    this.graphList = this.graphOperation.getGraphs();
    this.activeGraph = this.graphList[this.graphOperation.getActiveGraph()];
    this.graphsCount = this.graphList.length;
  }

  createNamedGraph(newGraphName: string) {
    let newGraph = newGraphName;
    if (newGraphName.search("http://") != -1) {
      this.graphOperation.addGraph(newGraph);
    } else {
      newGraph = "http://" + newGraph
      this.graphOperation.addGraph(newGraph);
    }
    this.graphList = this.graphOperation.getGraphs();
    this.activeGraph = this.graphList[this.graphOperation.getActiveGraph()];
    this.graphsCount = this.graphList.length;
  }

  setActiveGraph(graph: string) {
    if (this.graphSetOption.valid) {
      for (let i = 0; i < this.graphList.length; i++) {
        if (this.graphList[i].search(graph) != -1) {
          this.graphOperation.setActiveGraph(i);
          this.graphList = this.graphOperation.getGraphs();
          this.activeGraph = this.graphList[this.graphOperation.getActiveGraph()];
          this.graphsCount = this.graphList.length;
        }
      }
    } else if (this.graphSetOption.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }

  uploadGraph(graph: string, dataFormatName: string) {
    console.log(graph);
    console.log(dataFormatName);
    this.messageService.addMessage('warning', 'Ups!', 'It seems like you discovered some WIP')

  }

  downloadGraph(graph: string, dataFormatName: string) {
    if (this.downloadOption.valid) {
      let dataFormat: FormatDescription;
      for (const i in this.dataFormats) {
        // console.log(this.dataFormats[i].formatName)
        if (this.dataFormats[i].formatName == dataFormatName) {
          dataFormat = this.dataFormats[i]
        }
      }
      this.graphOperation.getTriplesOfNamedGraph(graph, dataFormat)

    } else if (this.downloadOption.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  deleteTriplesOfNamedGraph(graph) {
    if (this.graphDeleteTriplesOption.valid) {
      this.graphOperation.deleteTriplesOfNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
        // this.refreshServices();
      })
    } else if (this.graphDeleteTriplesOption.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }

  deleteNamedGraph(graph) {
    if (this.graphDeleteOption.valid) {
      this.graphOperation.deleteNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
        for (let i = 0; i < this.graphList.length; i++) {
          if (this.graphList[i].search(graph) != -1) {
            this.graphOperation.deleteGraph(i);
            this.graphList = this.graphOperation.getGraphs();
            this.activeGraph = this.graphList[this.graphOperation.getActiveGraph()];
            this.graphsCount = this.graphList.length;
          }
        }
      })
    } else if (this.graphDeleteOption.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }

}
