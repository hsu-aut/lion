import { Component, OnInit } from '@angular/core';
import { GenericCardContentComponent } from '../../generic-card-content.component';

@Component({
  selector: 'app-create-simple-object-property',
  templateUrl: './create-simple-object-property.component.html',
  styleUrls: ['./create-simple-object-property.component.scss']
})
export class CreateSimpleObjectPropertyComponent extends GenericCardContentComponent implements OnInit {

  // // array all card types for dropdown and total number
  // public allClasses: Array<string>;
  // public nOfAllClasses: number;

  ngOnInit(): void {
    // this.getAllClasses();
  }

  // getAllClasses(): void {
  //   this.genericOdpModelService.getAllClasses().subscribe((data: Array<string>) =>{
  //     this.allClasses = data;
  //     this.nOfAllClasses = data.length;
  //   }); 
  // }

}