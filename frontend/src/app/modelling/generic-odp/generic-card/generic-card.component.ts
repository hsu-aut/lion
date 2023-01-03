import { Component, EventEmitter, Input, OnInit, Output, Type, ViewChild } from '@angular/core';
import { GenericCardContentComponent } from './generic-card-content.component';
import { GenericCardConfig } from '../generic-odp-config.interface';
import { GenericCardImplementationsService } from './generic-card-implementations/generic-card-implementations.service';
import { GenericCardContentDirective } from './generic-card-content.directive';

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
})
export class GenericCardComponent implements OnInit {

  @ViewChild(GenericCardContentDirective, {static: true}) genericCardContent!: GenericCardContentDirective;

  @Input() public config: GenericCardConfig;
  @Input() public editMode: boolean;

  @Output("onRemoveCard") onRemoveCard = new EventEmitter<number>();
  @Output("onMoveCardUp") onMoveCardUp = new EventEmitter<number>();
  @Output("onMoveCardDown") onMoveCardDown = new EventEmitter<number>();


  constructor( private genericCardImplementationsService: GenericCardImplementationsService) { }

  ngOnInit(): void {
    const componentType: typeof GenericCardContentComponent = this.genericCardImplementationsService.getComponent(this.config);
    const viewContainerRef = this.genericCardContent.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<GenericCardContentComponent>(componentType);
    componentRef.instance.data = this.config.data;
  }

  removeCard(): void {
    this.onRemoveCard.emit(this.config.id);
  }

  moveCardUp(): void {
    this.onMoveCardUp.emit(this.config.id);
  }

  moveCardDown(): void {
    this.onMoveCardDown.emit(this.config.id);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  changeDescriptionText(newDescriptionText: string): void {
    console.log(newDescriptionText)
    this.config.descriptionText = newDescriptionText;
  }

}

