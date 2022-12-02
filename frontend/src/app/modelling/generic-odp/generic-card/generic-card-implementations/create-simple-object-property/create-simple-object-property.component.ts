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

  // array of all classes for dropdown and total number
  public allClasses: Array<string>;
  public nOfClasses: number;   // currently not used

  // array of all individuals of selected class and total number
  public allIndividualsOfClass: Array<string>;
  public nOfIndividualsOfClass: number;   // currently not used

  // forms
  newObjectPropertyForm1 = this.formBuilder.group({
      fc1: ["", Validators.required]
  })
  newObjectPropertyForm2 = this.formBuilder.group({
    fc2: ["", Validators.required],
    fc3: ['rdf:type'],
    fc4: ["", Validators.required],
  })

  ngOnInit(): void {
    this.getAllClasses();
  }

  getAllClasses(): void {
    this.genericOdpModelService.getAllClasses().subscribe((data: Array<string>) =>{
      this.allClasses = data;
      this.nOfClasses = data.length;
    }); 
  }

  /**
   * executed when class is selected, all matching individuals are selected for domain individual dropdown
   */
  onClassSelection(): void {
    // get iri from form
    const classIri: string = this.newObjectPropertyForm1.controls['fc1'].value;
    if ( classIri==null || classIri==undefined || classIri=="") { 
      return; 
    }
    // request matching individuals
    this.genericOdpModelService.getAllIndividualsOfClass(classIri).subscribe((data: Array<string>) =>{
      this.allIndividualsOfClass = data;
      this.nOfIndividualsOfClass = data.length;
    }); 
  }

}