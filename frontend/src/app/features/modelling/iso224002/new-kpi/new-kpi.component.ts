import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '@shared-services/messages.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { ISO224002Variables, Iso22400_2ModelService } from '../../rdf-models/iso22400_2Model.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-new-kpi',
  templateUrl: './new-kpi.component.html',
  styleUrls: ['./new-kpi.component.scss']
})
export class NewKpiComponent implements OnInit {

  // input variable that can be changed to trigger updates
  @Input() updateBoolean: boolean;

  //
  @Input() entityName: string;

  //
  @Output("onNewTriple") onNewTriple = new EventEmitter<void>();

  /**
   * form to create a new kpi
   */
  public KPIForm: FormGroup = this.formBuilder.group({
    kpiGroup: [undefined, Validators.required],
    kpiClass: [undefined, Validators.required],
    entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
    entityClass: [undefined, Validators.required],
    kpiPeriod: [undefined, Validators.required],
    value: [undefined, Validators.required],
    unitOfMeasure: [undefined, Validators.required],
    timing: [undefined, Validators.required],
  })

  // dropdown data ??
  public allKPIClassesPerGroup: Array<string> = [];
  public possibleTiming: Array<string> = [];

  // dropdown data
  public organizationalElementClasses: Array<string> = [];
  public KPIGroups: Array<string> = [];

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
      this.KPIForm.controls['entity'].setValue(this.entityName);
    }
  }

  /**
   * method to create triple via model service
   * @param action
   */
  public createTriple(action: string): void {
    if (this.KPIForm.valid) {
      // get variables from form
      const KPIVariables: ISO224002Variables["KPI"] = {
        entityIRI: this.prefixService.addOrParseNamespace(this.KPIForm.controls['entity'].value),
        entityClass: this.prefixService.parseToIRI(this.KPIForm.controls['entityClass'].value),
        KPI_IRI: this.prefixService.addOrParseNamespace(this.KPIForm.controls['entity'].value) + "_" + this.prefixService.parseToName(this.KPIForm.controls['kpiClass'].value),
        KPI_Class: this.prefixService.parseToIRI(this.KPIForm.controls['kpiClass'].value),
        timing: this.KPIForm.controls['timing'].value,
        relevantPeriod: this.KPIForm.controls['kpiPeriod'].value,
        UnitOfMeasure: this.KPIForm.controls['unitOfMeasure'].value,
        simpleValue: this.KPIForm.controls['value'].value,
      };
      // create element via model service
      this.isoService.createKPI(KPIVariables, action).pipe(take(1)).subscribe((data: any) => {
        // update statistics and drowpdowns when finished
        this.onNewTriple.emit();
      });
    } else if (this.KPIForm.invalid) {
      this.messageService.warn('Ups!','It seems like you are missing some data here...')
    }
  }

  /**
   * get data for dropdowns of create element form
   */
  private getDropwDownInfo(): void {
    this.isoService.getListOfOrganizationalElementClasses().subscribe((data: string[]) => this.organizationalElementClasses = data);
    this.isoService.getListOfKPIGroups().subscribe((data: string[]) => this.KPIGroups = data);
  }

  /**
   * TODO
   * @param selectedKPIGroup
   */
  public loadClassesKPI(selectedKPIGroup) {
    if (selectedKPIGroup) {
      this.isoService.getListOfElementsByGroup(selectedKPIGroup).subscribe((data: string[]) => this.allKPIClassesPerGroup = data);
      // NOTE - this was previously assigned to allElementClassesPerGroup which dindn't really make sense
      // TODO - check if this was correct
    }
  }

  /**
   * TODO
   * @param KPI_Class
   */
   public loadTimingConstraint(KPI_Class) {
    console.log(KPI_Class);
    if (KPI_Class) {
      // TODO getListOfClassConstraintEnum exists for this use case only - could ConstraingDataProperty also be a constant?
      const ConstraingDataProperty = "http://www.hsu-ifa.de/ontologies/ISO22400-2#Timing";
      this.isoService.getListOfClassConstraintEnum(KPI_Class, ConstraingDataProperty).subscribe((data: string[]) => this.possibleTiming = data);
    }
}

}
