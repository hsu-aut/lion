import { Component, OnInit } from '@angular/core';
import { GenericCardImplementationsService } from './generic-card/generic-card-implementations/generic-card-implementations.service';
import { GenericCardConfig } from './generic-card/generic-card-implementations/generic-card-config.interface';

@Component({
  selector: 'app-generic-odp',
  templateUrl: './generic-odp.component.html',
  styleUrls: ['./generic-odp.component.scss']
})
export class GenericOdpComponent implements OnInit {

  constructor( 
    private genericCardImplementationsService: GenericCardImplementationsService
  ) { }

  public configs: Array<GenericCardConfig> = [ ];

  public possibleCardTypes: Array<string> = this.genericCardImplementationsService.getComponentTypeNames();
  
  ngOnInit(): void {
    
  }

  public newCard(cardType: string): void {
    // probably not necessary
    if (!(this.possibleCardTypes.includes(cardType))) { 
      console.log(cardType + " does not exist!");
      return;
    }
    this.configs.push({
      id: null,
      title: "add title here",
      type: cardType,
      data: "data2"
    });
    this.generateNewIds();
  }

  public removeCard(id: number): void {
    if (this.configs.length<id) { 
      console.log("card to delete does not exist!");
      return;
    }
    this.configs.splice(id, 1);
    this.generateNewIds();
  }

  public generateNewIds(): void {
    for (let i = 0; i < this.configs.length; i++) {
      this.configs[i].id = i;
    }
  }

}
