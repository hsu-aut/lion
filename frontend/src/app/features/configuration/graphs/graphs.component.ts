import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { DataFormat, DataFormatHandler, FormatDescription } from '@shared/models/DataFormats';
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
    dataFormats = DataFormatHandler.getFormatDescriptions();

    // stats
    graphsCount: number;

    // namespace config
    graphList: Array<GraphDto>;
    activeGraph: GraphDto;

    // forms
    graphSetOption = this.fb.control('', Validators.required);
    graphDeleteOption = this.fb.control('', Validators.required);
    graphDeleteTriplesOption = this.fb.control('', Validators.required);
    newGraph = this.fb.control('', [Validators.required, Validators.pattern('http://.+')]);
    downloadOption = this.fb.group({
        graph: ["", Validators.required],
        dataFormat: this.fb.control<FormatDescription>(null,  Validators.required),
    })
    uploadOption = this.fb.group({
        graph: ["", Validators.required],
    })
    fileToUpload: File;

    constructor(
        private fb: FormBuilder,

        private graphService: GraphOperationsService,
        private messageService: MessagesService

    ) { }

    ngOnInit(): void {
        this.loadGraphList();
        this.graphService.getActiveGraph().subscribe(activeGraph => this.activeGraph = activeGraph);
    }

    private loadGraphList(): void {
        this.graphService.getAllGraphsOfWorkingRepository().subscribe(graphs => {
            this.graphList = graphs;
            this.graphsCount = this.graphList.length;
        });
    }

    /**
     * Adds a new named graph to the current working repository
     */
    createNamedGraph(): void {
        if(this.newGraph.invalid) {
            console.log(this.newGraph);

            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
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

    setUploadFile(eventTarget: HTMLInputElement) {
        this.fileToUpload = eventTarget.files.item(0);
    }

    /**
     *
     */
    uploadGraph(): void {
        const graphIri = this.uploadOption.get('graph').value;
        this.graphService.addTriplesToNamedGraph(this.fileToUpload, graphIri).subscribe();
        this.messageService.addMessage('warning', 'Ups!', 'It seems like you discovered some WIP');
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
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
        }

        this.graphService.getTriplesOfNamedGraph(graphIri, dataFormat);
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
            return;
        }

        const graphIriToDelete = this.graphDeleteOption.value;
        if (this.activeGraph.graphIri == graphIriToDelete) {
            this.messageService.addMessage('error', 'Error', 'You cannot delete the currently selected (active) graph.');
            return;
        }

        this.graphService.deleteNamedGraph(graphIriToDelete).subscribe({
            next: () => {
                this.messageService.addMessage("success", "Graph deleted", `Deleted named graph with IRI ${graphIriToDelete}`);
                this.loadGraphList();
            },
            error: (error) => this.messageService.addMessage("error", "Error", `Error while deleting named graph ${graphIriToDelete}. ${error}`)
        });
    }

}
