import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../../../app-routing.module'

@Component({
  selector: 'app-vertical-nav-panel',
  templateUrl: './vertical-nav-panel.component.html',
  styleUrls: ['./vertical-nav-panel.component.scss']
})
export class VerticalNavPanelComponent implements OnInit {

  routes = new AppRoutingModule().getRoutes();
  

  constructor() { }

  ngOnInit() {
  }

}
