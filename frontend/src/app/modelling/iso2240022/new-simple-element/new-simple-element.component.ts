import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../../../shared/services/messages.service';
import { PrefixesService } from '../../../shared/services/prefixes.service';
import { Iso22400_2ModelService, ISO224002Variables } from '../../rdf-models/iso22400_2Model.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-new-simple-element',
  templateUrl: './new-simple-element.component.html',
  styleUrls: ['./new-simple-element.component.scss']
})
export class NewSimpleElementComponent implements OnInit {

  // input variable that can be changed to trigger updates
  @Input() updateBoolean: boolean;

  //
  @Input() entityName: string;
  
  //
  @Output("onNewTriple") onNewTriple = new EventEmitter<void>();

  /**
   * form to create a new simple element
   */
  public simpleElementForm: FormGroup = this.formBuilder.group({
    elementGroup: [undefined, Validators.required],
    elementClass: [undefined, Validators.required],
    entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
    entityClass: [undefined, Validators.required],
    // elementPeriod: [undefined, [Validators.required, Validators.pattern('[1-9][0-9]{3}-.+T[^.]+(Z|[+-].+)')]],
    elementPeriod: [undefined, Validators.required],
    value: [undefined],
    unitOfMeasure: [undefined],
    // duration: [undefined, Validators.pattern('^(-?)P(?=.)(([0-9]*)Y)?(([0-9]+)M)?(([0-9]*)D)?(T(?=[0-9])([0-9]+H)?(([0-9]+)M)?(([0-9]+(?:\.[0-9]+))S)?)?$')],
    duration: [undefined],
  })

  // conditionals
  public anyValueReadOnly = false;
  public timeValueReadOnly = false;

  // dropdown data  
  public allElementClassesPerGroup: Array<string> = [];
  public organizationalElementClasses: Array<string> = [];
  public elementGroups: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private isoService: Iso22400_2ModelService,
    private prefixService: PrefixesService,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
  }

  /**
   * updates triggered by other components
   */
   ngOnChanges(changes: SimpleChanges) {
    // updates dropdowns if new triples are added
    if (changes['updateBoolean']) {
      // only update once
      if (this.updateBoolean) { this.getDropwDownInfo(); }
    }
    // updates entity name in form when input variabel entityName is changed 
    if (changes['entityName']) {
      this.simpleElementForm.controls['entity'].setValue(this.entityName);
    }
  }

  /**
   * method to create triple via model service
   * @param action
   */
  public createTriple(action: string): void {
    if (this.simpleElementForm.valid) {
      // get variables from form
      const elementVariables: ISO224002Variables["simpleElement"] = {
        elementIRI: this.prefixService.addOrParseNamespace(this.simpleElementForm.controls['entity'].value) + "_" + this.prefixService.parseToName(this.simpleElementForm.controls['elementClass'].value),
        elementClass: this.prefixService.parseToIRI(this.simpleElementForm.controls['elementClass'].value),
        entityIRI: this.prefixService.addOrParseNamespace(this.simpleElementForm.controls['entity'].value),
        entityClass: this.prefixService.parseToIRI(this.simpleElementForm.controls['entityClass'].value),
        relevantPeriod: this.simpleElementForm.controls['elementPeriod'].value,
        UnitOfMeasure: this.simpleElementForm.controls['unitOfMeasure'].value,
        duration: this.simpleElementForm.controls['duration'].value,
        simpleValue: this.simpleElementForm.controls['value'].value,
      };
      // create element via model service
      this.isoService.createElement(elementVariables, action).pipe(take(1)).subscribe((data: any) => {
        // update statistics and drowpdowns when finished
        this.onNewTriple.emit();
      });
    } else if (this.simpleElementForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
    }
  }

  /**
   * get data for dropdowns of create element form
   */
  private getDropwDownInfo(): void {
    this.isoService.getListOfElementGroups().subscribe((data: string[]) => this.elementGroups = data);
    this.isoService.getListOfOrganizationalElementClasses().subscribe((data: string[]) => this.organizationalElementClasses = data);
  }

  /**
   * TODO
   * @param selectedElementGroup
   */
  public loadClassesElement(selectedElementGroup) {
    if (selectedElementGroup) {
      this.isoService.getListOfElementsByGroup(selectedElementGroup).subscribe((data: string[]) => this.allElementClassesPerGroup = data);
    }
  }

  /**
   * TODO
   * @param selectedElementClass 
   */
  public setValueVisibility(selectedElementClass: string) {
    if (selectedElementClass) {
      if (selectedElementClass.search("Time") != -1) {
          this.timeValueReadOnly = true;
          this.anyValueReadOnly = false;
          this.simpleElementForm.controls['value'].setValue(undefined);
          this.simpleElementForm.controls['unitOfMeasure'].setValue(undefined);
      } else {
          this.timeValueReadOnly = false;
          this.anyValueReadOnly = true;
          this.simpleElementForm.controls['duration'].setValue(undefined);
      }
    }
  }

}
