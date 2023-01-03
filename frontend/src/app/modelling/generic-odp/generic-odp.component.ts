import { Component, OnInit } from '@angular/core';
import { GenericCardImplementationsService } from './generic-card/generic-card-implementations/generic-card-implementations.service';
import { GenericCardConfig } from './generic-odp-config.interface';
import { GenericOdpConfig } from './generic-odp-config.interface';

@Component({
  selector: 'app-generic-odp',
  templateUrl: './generic-odp.component.html',
  styleUrls: ['./generic-odp.component.scss']
})
export class GenericOdpComponent implements OnInit {

  constructor( 
    private genericCardImplementationsService: GenericCardImplementationsService
  ) { }

  public config: GenericOdpConfig = {
    title: "Generic ODP",
    descriptionText: "Add description text here",
    cardConfigs: [ ]
  }

  public editMode: boolean = false;
  public possibleCardTypes: Array<string> = this.genericCardImplementationsService.getComponentTypeNames();
  
  ngOnInit(): void {
    
  }

  public newCard(cardType: string): void {
    // check if card type exists, probably not necessary
    if (!(this.possibleCardTypes.includes(cardType))) { 
      console.log(cardType + " does not exist!");
      return;
    }
    // push new card
    this.config.cardConfigs.push({
      id: null,
      type: cardType,
      title: "Add a title here",
      descriptionText: 'Add a description here',
      data: "data2",
    });
    this.generateNewIds();
  }

  public removeCard(id: number): void {
    // check if card exist, probably not necessary
    if (!(this.config.cardConfigs[id])) {
      console.log("card does not exist");
      return;
    }
    // remove
    this.config.cardConfigs.splice(id, 1);
    this.generateNewIds();
  }

  public moveCardDown(id: number): void {
    // check if card below exist
    if (!(this.config.cardConfigs[id+1])) {
      console.log("can't move down");
      return;
    }
    // exchange 
    const tempConfig: GenericCardConfig = this.config.cardConfigs[id+1];
    this.config.cardConfigs[id+1] = this.config.cardConfigs[id];
    this.config.cardConfigs[id] = tempConfig;
    this.generateNewIds();
  }

  public moveCardUp(id: number): void {
    // check if card above exist
    if (!(this.config.cardConfigs[id-1])) {
      console.log("can't move up");
      return;
    }
    // exchange 
    const tempConfig: GenericCardConfig = this.config.cardConfigs[id-1];
    this.config.cardConfigs[id-1] = this.config.cardConfigs[id];
    this.config.cardConfigs[id] = tempConfig;
    this.generateNewIds();
  }

  public generateNewIds(): void {
    for (let i = 0; i < this.config.cardConfigs.length; i++) {
      this.config.cardConfigs[i].id = i;
    }
  }

  public toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

}
