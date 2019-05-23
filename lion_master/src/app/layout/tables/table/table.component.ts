import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Tables } from '../../rdf-modelling/utils/tables';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  // get table
  @Input() currentTable: Array<Object> = [];
  @Input() tableTitle: string;
  @Input() tableExplanation: string;
  @Output() tableClickedRow = new EventEmitter<Array<Object>>();
  @Output() tableClickedCell = new EventEmitter<string>();

  // util variables
  keys = Object.keys;
  TableUtil = new Tables();

  // layout variables
  paginationArray = this.TableUtil.paginationValues;
  paginationNumber = this.TableUtil.paginationValues[this.TableUtil.defaultPaginationIndex];
  pagedTable: Array<Array<Object>> = [[]];
  numberOfRows = this.currentTable.length;
  numberOfPages: number;
  pageArray: Array<number> = [];
  currentPage: number = 0;


  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.setRowCount();
    this.setPageCount();
    this.setPagArray();
    //console.log(this.numberOfPages)

  }


  tableClickRow(clickedRow: Array<Object>) {
    this.tableClickedRow.emit(clickedRow);
  };
  tableClickCell(cleckedCell: string) {
    this.tableClickedCell.emit(cleckedCell);
  };
  setPaginationNumber(selectedNumber: number) {
    this.paginationNumber = selectedNumber;
    this.setPageCount();
    this.setCurrentPage(0);
    this.setPagArray();
  }
  nextPage() {
    if (this.currentPage < this.numberOfPages - 1) { this.currentPage++; }
  }
  previousPage() {
    if (this.currentPage > 0) { this.currentPage--; }
  }
  firstPage() {
    this.currentPage = 0;
  }
  lastPage() {
    this.currentPage = this.numberOfPages - 1;
  }
  setPageCount() {
    this.pageArray = [];
    this.numberOfPages = Math.ceil(this.numberOfRows / this.paginationNumber);
    console.log(Math.ceil(this.numberOfRows / this.paginationNumber))
    for (let i = 0; i < this.numberOfPages; i++) {
      this.pageArray[i] = i + 1;
    }
  }
  setRowCount() {
    this.numberOfRows = this.currentTable.length;
  }
  setPagArray() {
    var newPagTable: Array<Array<Object>> = [];
    var row: number = 0;

    for (let i = 0; i < this.numberOfPages; i++) {
      let pagedTableSlice: Array<Object> = [];
      for (let ii = 0; ii < this.paginationNumber; ii++) {
        if (this.currentTable[row] == undefined) { break };
        pagedTableSlice[ii] = this.currentTable[row];
        row++;
      }
      newPagTable.push(pagedTableSlice);
    }
    this.pagedTable = newPagTable;
  }
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

}
