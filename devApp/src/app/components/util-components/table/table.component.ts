import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  // util variables
  keys = Object.keys;

  // get table
  @Input() currentTable: Array<Object>; 
  @Output() tableClickedRow = new EventEmitter<Array<Object>>();
  @Output() tableClickedCell = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  tableClickRow(clickedRow: Array<Object>){
    this.tableClickedRow.emit(clickedRow);
  };
  tableClickCell(cleckedCell: string){
    this.tableClickedCell.emit(cleckedCell);
  };
}
