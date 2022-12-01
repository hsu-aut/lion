import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GenericCardImplementationsService } from '../generic-card/generic-card-implementations/generic-card-implementations.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.scss']
})
export class NewCardComponent implements OnInit {
  //
  @Output("onNewCard") onNewCard = new EventEmitter<string>();
  
  constructor(
    private genericCardImplementationsService: GenericCardImplementationsService, 
  ) { }

  public dropdownOptions: Array<string>;

  ngOnInit(): void {
    this.dropdownOptions = this.genericCardImplementationsService.getComponentTypeNames();
  }

  public addNewCard(cardType: string): void {
    this.onNewCard.emit(cardType);
  }

}
