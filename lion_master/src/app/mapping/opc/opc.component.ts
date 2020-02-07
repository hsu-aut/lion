import { Component, OnInit } from '@angular/core';
import { EntitiesService, Literial, NamedNode } from '../../shared/services/entities.service'
@Component({
  selector: 'app-opc',
  templateUrl: './opc.component.html',
  styleUrls: ['./opc.component.scss']
})
export class OpcComponent implements OnInit {

  some:Literial;
  
  
  constructor( 
    private entities: EntitiesService
   ) { }

  ngOnInit() {
    console.log(this.some)
    this.anyFunc(this.entities.createNamedNode("asdasd"))
  }

  anyFunc(asd: NamedNode){
    console.log(asd.userinfo)
  }

}
