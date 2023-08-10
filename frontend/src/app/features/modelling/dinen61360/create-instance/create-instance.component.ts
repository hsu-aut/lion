import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Dinen61360Service } from '../../rdf-models/dinen61360Model.service';
import { DINEN61360Variables } from '@shared/models/dinen61360-variables.interface';
import { Isa88ModelService } from '../../rdf-models/isa88Model.service';
import { Vdi3682ModelService } from '../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { Iso22400_2ModelService } from '../../rdf-models/iso22400_2Model.service';

import { PrefixesService } from '@shared-services/prefixes.service';

import { MessagesService } from '@shared-services/messages.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-create-instance',
    templateUrl: './create-instance.component.html',
    styleUrls: ['./create-instance.component.scss']
})

export class CreateInstanceComponent implements OnInit {
  @Output("onUpdate") onUpdate = new EventEmitter<void>();

  /**
   * model variables without type variables
   */
  private modelVariables: DINEN61360Variables = {
      optionalTypeVariables: undefined,
      mandatoryTypeVariables: undefined,
      instanceVariables: {
          code: undefined,
          expressionGoalString: undefined,
          logicInterpretationString: undefined,
          valueString: undefined,
          describedIndividual: undefined
      }
  }

  /**
   * instance description form
   */
  public instanceDescriptionForm: FormGroup = this.formBuilder.group({
      code: [undefined, [Validators.required, Validators.pattern('([A-Z]{3})([0-9]{3})')]],
      individual: [undefined, [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('(^((?!://).)*$)')]],
      expressionGoal: [undefined, Validators.required],
      logicInterpretation: [undefined, Validators.required],
      value: [undefined, Validators.required]
  })

  // filter option
  public filterOption = true;

  // tables
  public allInstances: Array<Record<string, any>> = [];
  public allTypes: Array<Record<string, any>> = [];

  // dropdowns
  public expressionGoals: Array<string> = [];
  public logicInterpretations: Array<string> = [];

  // data from VDI 3682
  public allProcessInfo = new Array<Record<string, any>>();

  // data from vdi2206
  public allStructureInfoContainmentbySys: Array<Record<string, any>> = [];
  public allStructureInfoContainmentbyMod: Array<Record<string, any>> = [];
  public allStructureInfoContainmentbyCOM: Array<Record<string, any>> = [];

  // data from iso 22400-2
  public isoInfo: Array<Record<string, any>> = [];

  // data from ISA 88
  public allBehaviorInfo: Array<Record<string, any>> = [];

  constructor(
    private formBuilder: FormBuilder,
    private nameService: PrefixesService,
    private dinen61360Service: Dinen61360Service,
    private vdi3682Service: Vdi3682ModelService,
    private isa88Service: Isa88ModelService,
    private messageService: MessagesService,
    private vdi2206Service: Vdi2206ModelService,
    private isoService: Iso22400_2ModelService,
  ) {

  }

  ngOnInit(): void {
      this.getDropdowns();
      this.getTables();
  }

  /**
   * update dropdown options
   */
  private getDropdowns(): void {
      this.dinen61360Service.getListOfLogicInterpretations().subscribe((data: any) => this.logicInterpretations = data);
      this.dinen61360Service.getListOfExpressionGoals().subscribe((data: any) => this.expressionGoals = data);
  }

  /**
   * update content of existing types/instances and content from other odps
   */
  private getTables(): void {
      this.dinen61360Service.getTableOfAllTypes().subscribe((data: any) => this.allTypes = data);
      this.dinen61360Service.getTableOfAllInstanceInfo().subscribe((data: any) => this.allInstances = data);
      this.isoService.getTableOfAllEntityInfo().subscribe((data: any) => this.isoInfo = data);
      this.isa88Service.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.allBehaviorInfo = data);
      this.vdi3682Service.getCompleteProcessInfo().subscribe(data => this.allProcessInfo = data);
      this.isa88Service.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.allBehaviorInfo = data);
      // TODO: replace the remaining code as soon as vdi2206 model service etc. is updated
      //   this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
      //   this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
      //   this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
  }

  /**
   * create a triple or download the equivalent sparql update strong
   * @param action
   * @param form
   */
  public createTriple(action: string, form: any): void {
      if (form.valid) {
          const instanceModelVariables = {
              code: this.instanceDescriptionForm.controls['code'].value,
              expressionGoalString: this.instanceDescriptionForm.controls['expressionGoal'].value,
              logicInterpretationString: this.instanceDescriptionForm.controls['logicInterpretation'].value,
              valueString: this.instanceDescriptionForm.controls['value'].value,
              describedIndividual: this.nameService.addOrParseNamespace(this.instanceDescriptionForm.controls['individual'].value)
          };
          this.modelVariables.instanceVariables = instanceModelVariables;
          console.log(this.modelVariables);
          this.dinen61360Service.modifyInstance(action, this.modelVariables).pipe(take(1)).subscribe((data: any) => {
              this.getDropdowns();
              this.getTables();
              this.onUpdate.emit();
          });
          console.log(action);
          console.log(form);
      } else if (form.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...');
      }
  }

  /**
   * transfer data from type table to form
   * @param row
   */
  public typeTableClick(row: any): void  {
      this.instanceDescriptionForm.controls['code'].setValue(row.code);
  }

  /**
   * transfer data from other tables to form
   * @param name
   */
  public anyTableClick(name: string): void  {
      this.instanceDescriptionForm.controls['individual'].setValue(name);
  }

}
