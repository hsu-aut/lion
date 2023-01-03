import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-card',
  templateUrl: './header-card.component.html',
  styleUrls: ['./header-card.component.scss']
})
export class HeaderCardComponent implements OnInit {

  @Output("onToggleEditMode") onToggleEditMode = new EventEmitter<void>();
  @Input() editMode: boolean;
  @Input() title: boolean;
  @Input() descriptionText: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleEditMode(): void {
    this.onToggleEditMode.emit();
  }

}
