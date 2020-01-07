import { Component, OnInit } from '@angular/core';
import { OpcMappingService } from './opc-mapping.service';

@Component({
  selector: 'app-opc',
  templateUrl: './opc.component.html',
  styleUrls: ['./opc.component.scss']
})
export class OpcComponent implements OnInit {

    opcModelString: string;
    opcModel;

  constructor(private opcService: OpcMappingService) { }

  ngOnInit() {
  }

  createTree() {
      if (this.opcModelString.length > 0) {
        this.opcModel = JSON.parse(this.opcModelString);
        console.log(this.opcModel);
      }
  }

  getSelection() {
      this.opcService.getSelection();
  }

}
