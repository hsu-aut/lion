import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GenericOdpModelService } from '../../../../rdf-models/generic-odp-model.service';
import { GenericCardContentComponent } from '../../generic-card-content.component';

@Component({
  selector: 'app-create-simple-object-property',
  templateUrl: './create-simple-object-property.component.html',
  styleUrls: ['./create-simple-object-property.component.scss']
})
export class CreateSimpleObjectPropertyComponent extends GenericCardContentComponent implements OnInit {

  // array of all domain individuals and total number
  public domainIndividuals: Array<string>;
  public numberOfDomainIndividuals: number; // currently not used

  // array of all possible object properties for domain individual and total number
  public objectProperties: Array<string>
  public numberOfObjectProperties: number; // currently not used

  // array of all range individuals of and total number
  public rangeIndividuals: Array<string>
  public numberOfRangeIndividuals: number; // currently not used

  // array of all classes for filter dropdown and total number
  public classes: Array<string>;
  public numberOfClasses: number;   // currently not used

  // text to display in dropdown ... 
  // declared as a variable to avoid typos
  public allIndividualsFilterText: string = "Show all individuals"

  // forms
  newObjectPropertyForm1 = this.formBuilder.group({
      fc1: ["", Validators.required]
  })
  newObjectPropertyForm2 = this.formBuilder.group({
    fc2: ["", Validators.required],
    fc3: ["", Validators.required],
    fc4: ["", Validators.required],
  })

  ngOnInit(): void {
    this.getAllClasses();
    this.getAllIndividuals();
  }

  getAllClasses(): void {
    this.genericOdpModelService.getAllClasses().subscribe((data: Array<string>) =>{
      this.classes = data;
      this.numberOfClasses = data.length;
    }); 
  }

  getAllIndividuals(): void {
    this.genericOdpModelService.getAllIndividuals().subscribe((data: Array<string>) =>{
      this.domainIndividuals = data;
      this.numberOfDomainIndividuals = data.length;
    });
  }

  /**
   * executed when class is selected
   * all matching domain individuals are requested for dropdown
   */
  onClassFilterSelection(): void {
    // get class iri from form
    const classIri: string = this.newObjectPropertyForm1.controls['fc1'].value;
    // delete current entries
    this.domainIndividuals = [];
    this.numberOfDomainIndividuals = 0; 
    this.objectProperties = [];
    this.numberOfObjectProperties = 0;
    this.rangeIndividuals = [];
    this.numberOfRangeIndividuals = 0; 
    // request new data  
    if (classIri==this.allIndividualsFilterText) {
      // request all individuals
      this.getAllIndividuals();
    } else {
      // request matching individuals
      this.genericOdpModelService.getAllIndividualsOfClass(classIri).subscribe((data: Array<string>) =>{
        this.domainIndividuals = data;
        this.numberOfDomainIndividuals = data.length;
      });
    }
  }

  /**
   * executed when domain idividual is selected
   * all matching object properties are requested for dropdown
   */
  onDomainIndividualSelection(): void {
    // get individual iri from form
    const individualIri: string = this.newObjectPropertyForm2.controls['fc2'].value;
    // delete current entries
    this.objectProperties = [];
    this.numberOfObjectProperties = 0;
    this.rangeIndividuals = [];
    this.numberOfRangeIndividuals = 0;       
    // request matching object properties
    this.genericOdpModelService.getAllObjectPropertiesForDomainIndividual(individualIri).subscribe((data: Array<string>) =>{
      this.objectProperties = data;
      this.numberOfObjectProperties = data.length;
    });
  }

  /**
   * executed when object property is selected
   * all matching range individuals are requested for dropdown
   */
  onObjectPropertySelection(): void {
    // get object property iri from form
    const objectPropertyIri: string = this.newObjectPropertyForm2.controls['fc3'].value;
    // delete current entries
    this.rangeIndividuals = [];
    this.numberOfRangeIndividuals = 0;   
    // request matching range individuals
    this.genericOdpModelService.getAllRangeIndividualsForObjectProperty(objectPropertyIri).subscribe((data: Array<string>) =>{
      this.rangeIndividuals = data;
      this.numberOfRangeIndividuals = data.length;
    });
  }

  /**
   * executed when range idividual is selected
   * x
   */
  onRangeIndividualSelection(): void {
    return;
  }

}