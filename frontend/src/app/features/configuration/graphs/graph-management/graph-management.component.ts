import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessagesService } from '../../../../shared/services/messages.service';
import { FormBuilder, Validators } from '@angular/forms';
import { GraphOperationsService } from '../../../../shared/services/backEnd/graphOperations.service';
import { GraphDto } from '@shared/models/graphs/GraphDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-graph-management',
    templateUrl: './graph-management.component.html',
    styleUrls: ['./graph-management.component.scss']
})
export class GraphManagementComponent implements OnInit {

  // input variables from parent component
  @Input() graphList: Array<GraphDto>;

  // output event to trigger updates
  @Output() onLoadGraphList = new EventEmitter<void>();

  // util variables
  activeGraph: GraphDto;
  graphToConfirm: string;
  operationToConfirm: string;

  // forms
  graphSetOption = this.fb.control('', Validators.required);
  graphDeleteOption = this.fb.control('', Validators.required);
  graphDeleteTriplesOption = this.fb.control('', Validators.required);
  newGraph = this.fb.control('', [Validators.required, Validators.pattern('http://.+')]);

  constructor(
    private fb: FormBuilder,
    private graphService: GraphOperationsService,
    private messageService: MessagesService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
      this.graphService.getActiveGraph().subscribe(activeGraph => this.activeGraph = activeGraph);
      return;
  }

  /**
     * Adds a new named graph to the current working repository
     */
  createNamedGraph(): void {
      if(this.newGraph.invalid) {
          console.log(this.newGraph);

          this.messageService.warn('Ups!','It seems like you are missing some data here...');
          return;
      }
      const rawGraphIri = this.newGraph.value;
      const protocol = "http://";
      const graphIri = rawGraphIri.startsWith(protocol) ? rawGraphIri : `${protocol}${rawGraphIri}`;

      this.graphService.addGraph(graphIri).subscribe({
          next: () => {
              this.newGraph.reset();
              this.messageService.warn('Graph addded',`Added a new graph with IRI ${graphIri}`);
              this.onLoadGraphList.emit();
          },
          error: (error: HttpErrorResponse) => {
              console.log(error);
              this.messageService.warn("Error",`Error while adding new graph ${graphIri}. ${error}`);
          }
      });
  }

  /**
 * Sets the currently active graph that all triples are inserted into
 * @param graphIri
 */
  setActiveGraph(): void {
      if (this.graphSetOption.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...');
      }
      const newActiveGraphIri = this.graphSetOption.value;
      console.log(newActiveGraphIri);

      this.graphService.setActiveGraph(newActiveGraphIri).subscribe({
          next: (newGraph) => {
              this.messageService.warn('Active graph changed',`Changed the active graph to ${newGraph.graphIri}`);
              this.activeGraph = newGraph;
          },
          error: (error: HttpErrorResponse) => {
              console.log(error);
              this.messageService.warn("Error",`Error while changing the active graph ${newActiveGraphIri}. ${error}`);
          }
      });
  }

  clickClearTriplesOfNamedGraph(): void {
      if (this.graphDeleteTriplesOption.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...');
      }
      this.graphToConfirm = this.graphDeleteTriplesOption.value;
      this.openConfirmModal("clear");
  }

  clickDeleteNamedGraph(): void {
      if (this.graphDeleteOption.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...');
          return;
      }
      this.graphToConfirm  = this.graphDeleteOption.value;
      if (this.activeGraph.graphIri == this.graphToConfirm) {
          this.messageService.warn('Error','You cannot delete the currently selected (active) graph.');
          return;
      }
      this.openConfirmModal("delete");
  }

  openConfirmModal(operation: string): void {
      this.operationToConfirm = "none";
      // this is required in order for the modal to be reactivated after first use
      this.changeDetectorRef.detectChanges();
      this.operationToConfirm = operation;
  }

  onConfirm(): void {
      this.graphDeleteTriplesOption.reset();
      this.graphDeleteOption.reset();
      if (this.operationToConfirm == "clear") {
          this.graphService.deleteTriplesOfNamedGraph(this.graphToConfirm).subscribe({
              next: () => this.messageService.success("Graph clear", `Cleared triples of named graph with IRI ${this.graphToConfirm}`),
              error: (error: HttpErrorResponse) => {
                  console.log(error);
                  this.messageService.warn("Error",`Error while clearing triples of named graph ${this.graphToConfirm}. ${error}`);
              }
          });
      } else if (this.operationToConfirm == "delete") {
          this.graphService.deleteNamedGraph(this.graphToConfirm).subscribe({
              next: () => {
                  this.messageService.warn('Graph deleted',`Deleted named graph with IRI ${this.graphToConfirm}`);
                  this.onLoadGraphList.emit();
              },
              error: (error) => this.messageService.warn("Error", `Error while deleting named graph ${this.graphToConfirm}. ${error}`)
          });
      }
      return;
  }

}
