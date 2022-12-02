import { Directive, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GenericOdpModelService } from '../../rdf-models/generic-odp-model.service';

// empty directive decorator to enable angular functionalities
// this is only a superclass and does not have any reqular component features
@Directive() 
export class GenericCardContentComponent {

  // config input 
  @Input() data: any;

  constructor( 
    protected genericOdpModelService: GenericOdpModelService,
    protected formBuilder: FormBuilder
  ) { }

}
