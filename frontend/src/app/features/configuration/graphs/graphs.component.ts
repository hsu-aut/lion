import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { DataDescription, FormatDescription } from '../../modelling/utils/formats';
import { MessagesService } from '@shared-services/messages.service';

import { GraphOperationsService } from '../../../shared/services/backEnd/graphOperations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GraphDto } from '../../../../../models/graphs/GraphDto';


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
    graphList: Array<GraphDto>;
    activeGraph: GraphDto;

    // forms
    graphSetOption = this.fb.control('', Validators.required);
    graphDeleteOption = this.fb.control('', Validators.required);
    graphDeleteTriplesOption = this.fb.control('', Validators.required);
    newGraph = this.fb.control('', [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('([-a-zA-Z0-9()@:%_+.~#?&//=]){1,}')]);
    downloadOption = this.fb.group({
        graph: ["", Validators.required],
        dataFormat: ["", Validators.required],
    })
    uploadOption = this.fb.group({
        graph: ["", Validators.required],
        dataFormat: ["", Validators.required],
    })

    constructor(
        private fb: FormBuilder,

        private graphService: GraphOperationsService,
        private messageService: MessagesService

    ) { }

    ngOnInit(): void {
        this.loadGraphList();
        this.graphService.getActiveGraph().subscribe(activeGraph => this.activeGraph = activeGraph);
        this.graphsCount = this.graphList.length;
    }

    private loadGraphList(): void {
        this.graphService.getAllGraphsOfWorkingRepository().subscribe(graphs => this.graphList = graphs);
    }

    /**
     * Adds a new named graph to the current working repository
     */
    createNamedGraph(): void {
        if(this.newGraph.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        const rawGraphIri = this.newGraph.value;
        const protocol = "http://";
        const graphIri = rawGraphIri.startsWith(protocol) ? rawGraphIri : `${protocol}${rawGraphIri}`;

        this.graphService.addGraph(graphIri).subscribe({
            next: () => {
                this.newGraph.reset();
                this.messageService.addMessage("success", "Graph addded", `Added a new graph with IRI ${graphIri}`);
                this.loadGraphList();
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
                this.messageService.addMessage("error", "Error", `Error while adding new graph ${graphIri}. ${error}`);
            }
        });
    }

    /**
     * Sets the currently active graph that all triples are inserted into
     * @param graphIri
     */
    setActiveGraph(): void {
        if (this.graphSetOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        const newActiveGraphIri = this.graphSetOption.value;
        console.log(newActiveGraphIri);

        this.graphService.setActiveGraph(newActiveGraphIri).subscribe({
            next: (newGraph) => {
                this.messageService.addMessage("success", "Active graph changed", `Changed the active graph to ${newGraph.graphIri}`);
                this.activeGraph = newGraph;
            },
            error: (error: HttpErrorResponse) => {
                console.log(error);
                this.messageService.addMessage("error", "Error", `Error while changing the active graph ${newActiveGraphIri}. ${error}`);
            }
        });
    }

    uploadGraph(graph: string, dataFormatName: string) {
        console.log(graph);
        console.log(dataFormatName);
        this.messageService.addMessage('warning', 'Ups!', 'It seems like you discovered some WIP');

    }

    downloadGraph(graph: string, dataFormatName: string) {
        if (this.downloadOption.valid) {
            let dataFormat: FormatDescription;
            for (const i in this.dataFormats) {
                // console.log(this.dataFormats[i].formatName)
                if (this.dataFormats[i].formatName == dataFormatName) {
                    dataFormat = this.dataFormats[i];
                }
            }
            this.graphService.getTriplesOfNamedGraph(graph, dataFormat);

        } else if (this.downloadOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    /**
     * Clears all triples from a named graph without deleting the graph itself
     */
    clearTriplesOfNamedGraph(): void {
        if (this.graphDeleteTriplesOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        const graphIri = this.graphDeleteTriplesOption.value;
        this.graphService.deleteTriplesOfNamedGraph(graphIri).subscribe({
            next: () => this.messageService.addMessage("success", "Graph clear", `Cleared triples of named graph with IRI ${graphIri}`),
            error: (error: HttpErrorResponse) => {
                console.log(error);
                this.messageService.addMessage("error", "Error", `Error while clearing triples of named graph ${graphIri}. ${error}`);
            }
        });
    }

    /**
     * Deletes a named graph with all its triples
     */
    deleteNamedGraph(): void {
        if (this.graphDeleteOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        const graphIri = this.graphDeleteOption.value;
        this.graphService.deleteNamedGraph(graphIri).subscribe({
            next: () => {
                this.messageService.addMessage("success", "Graph deleted", `Deleted named graph with IRI ${graphIri}`);
                this.loadGraphList();
            },
            error: (error) => this.messageService.addMessage("error", "Error", `Error while deleting named graph ${graphIri}. ${error}`)
        });
    }

}
