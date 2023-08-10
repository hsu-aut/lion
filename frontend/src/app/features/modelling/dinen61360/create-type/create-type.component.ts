import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DINEN61360Variables } from '@shared/models/dinen61360-variables.interface';
import { EclassService } from '@shared-services/backEnd/eclass.service';
import { MessagesService } from '@shared-services/messages.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { Dinen61360Service } from '../../rdf-models/dinen61360Model.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.scss']
})
export class CreateTypeComponent implements OnInit {
  @Output("onUpdate") onUpdate = new EventEmitter<void>();

  /**
   * model variables without type variables
   */
  private modelVariables: DINEN61360Variables = {
    optionalTypeVariables: undefined,
    mandatoryTypeVariables: {
      typeIRI: undefined,
      code: undefined,
      version: undefined,
      revision: undefined,
      preferredName: undefined,
      shortName: undefined,
      definition: undefined,
      dataTypeIRI: undefined,
      unitOfMeasure: undefined
    },
    instanceVariables: undefined
  }

  /**
   * type description form
   */
  public typeDescriptionForm: FormGroup = this.formBuilder.group({
    code: [undefined, [Validators.required]],
    version: [undefined, [Validators.required, Validators.pattern('([0-9]{1,})')]],
    revision: [undefined, [Validators.required, Validators.pattern('([0-9]{1,})')]],
    preferred_name: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z; ;0-9]{1,})')]],
    short_name: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z]{1,})')]],
    definition: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z;  ]{1,})|([0-9]{1,})')]],
    dataType: [undefined, Validators.required],
    UoM: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z]{1,})|([0-9]{0,})')]]
  })

  /**
   * eclass search form
   */
  eclassSearchForm = this.formBuilder.group({
    searchTerm: [undefined],
  })

  // filter option
  public filterOption: boolean = true;

  // tables
  allTypes: Array<Record<string, any>> = [];

  // dropdowns
  public datatypes: Array<string> = [];

  // eclass table
  propertyList: Array<Record<string, any>> = [];

  constructor(
    private formBuilder: FormBuilder,
    private eclass: EclassService,
    private nameService: PrefixesService,
    private dinen61360Service: Dinen61360Service,
    private messageService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.getTable();
  }

  /**
   * create new triples in graph bd / download equivalent sparql update string
   * @param action
   * @param form
   */
  public createTriple(action: string, form) {
    if (form.valid) {
      const typeModelVariables = {
          typeIRI: this.nameService.addOrParseNamespace(this.typeDescriptionForm.controls['code'].value),
          code: this.typeDescriptionForm.controls['code'].value,
          version: this.typeDescriptionForm.controls['version'].value,
          revision: this.typeDescriptionForm.controls['revision'].value,
          preferredName: this.typeDescriptionForm.controls['preferred_name'].value,
          shortName: this.typeDescriptionForm.controls['short_name'].value,
          definition: this.typeDescriptionForm.controls['definition'].value,
          dataTypeIRI: this.nameService.parseToIRI(this.typeDescriptionForm.controls['dataType'].value),
          unitOfMeasure: this.typeDescriptionForm.controls['UoM'].value
      };
      this.modelVariables.mandatoryTypeVariables = typeModelVariables;
      console.log(this.modelVariables);
      this.dinen61360Service.modifyType(action, this.modelVariables).pipe(take(1)).subscribe((data: any) => {
        this.getTable();
        this.onUpdate.emit();
      });
      console.log(action);
      console.log(form);
    } else if (form.invalid) {
        this.messageService.warn('Ups!','It seems like you are missing some data here...')
    }
  }

  /**
   * update content in existing type table
   */
  private getTable(): void {
    this.dinen61360Service.getTableOfAllTypes().subscribe((data: any) => this.allTypes = data);
  }

  /**
   * transfer data from existing type table to form
   * @param row
   */
  public typeTableClick(row): void {
    this.typeDescriptionForm.controls['code'].setValue(row.code);
    this.typeDescriptionForm.controls['version'].setValue(row.version);
    this.typeDescriptionForm.controls['revision'].setValue(row.revision);
    this.typeDescriptionForm.controls['preferred_name'].setValue(row.preferredName);
    this.typeDescriptionForm.controls['short_name'].setValue(row.shortName);
    this.typeDescriptionForm.controls['definition'].setValue(row.definition);
    this.typeDescriptionForm.controls['dataType'].setValue(row.dataType);
    this.typeDescriptionForm.controls['UoM'].setValue(row.unitOfMeasure);
  }

  /**
   * transfer data from eclass table to form
   * @param row
   */
  public eclassTableClick(row): void {
    this.typeDescriptionForm.controls['code'].setValue(row.code);
    this.typeDescriptionForm.controls['version'].setValue(row.version);
    this.typeDescriptionForm.controls['revision'].setValue(row.revision);
    this.typeDescriptionForm.controls['preferred_name'].setValue(row.preferredName);
    this.typeDescriptionForm.controls['definition'].setValue(row.definition);
    this.typeDescriptionForm.controls['UoM'].setValue(row.unitShortName);

    // check for the data type of the eclass property
    const str = row.DataType.toLowerCase();
    for (let i = 0; i < this.datatypes.length; i++) {
        const element = this.nameService.parseToName(this.datatypes[i]);
        if (str.includes(element.toLowerCase())) {
            this.typeDescriptionForm.controls['dataType'].setValue(this.datatypes[i]);
        }
    }
    if (row.shortName == "" || row.shortName == " " || row.shortName == null) {
        this.typeDescriptionForm.controls['short_name'].setValue(row.preferredName.substring(0, 8));
    } else {
        this.typeDescriptionForm.controls['short_name'].setValue(row.shortName);
    }
  }

  /**
   * trigger search in eclass db / on eclass webservice
   * @param searchForm
   * @param via
   */
  public eclassSearch(searchForm: FormGroup, via: string): void {
    this.eclass.getPropertyList(searchForm.controls['searchTerm'].value, via).pipe(take(1)).subscribe((rawlist: any) => {
        this.propertyList = rawlist;
    });
  }

}
