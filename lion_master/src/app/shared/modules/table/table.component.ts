import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Tables } from '../../../modelling/utils/tables';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  // get table
  @Input() currentTable: Array<Object>;
  @Input() tableTitle: string;
  @Input() tableExplanation: string;
  @Input() filter: boolean;
  @Output() tableClickedRow = new EventEmitter<Array<Object>>();
  @Output() tableClickedCell = new EventEmitter<string>();

  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  filterRow: string = "";

  // layout variables
  paginationArray = this.TableUtil.paginationValues;
  paginationNumber = this.TableUtil.paginationValues[this.TableUtil.defaultPaginationIndex];
  pagedTable: Array<Array<Object>>;
  numberOfRows: number;
  numberOfPages: number;
  pageArray: Array<number> = [];
  currentPage: number = 0;
  originalTableArray: Array<Object> = [];
  filteredElements: Array<Object> = [];
  emptyTable: Array<Object> = [];


  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof this.currentTable !== 'undefined') {

      if (this.currentTable.length != 0) {

        this.originalTableArray = this.currentTable;
        this.initializeTable();
      }
    }

  }


  initializeTable() {
    this.numberOfRows = this.currentTable.length;
    this.setRowCount();
    this.setPageCount();
    this.setPagArray();
    this.setEmptyTable();
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
    // console.log(Math.ceil(this.numberOfRows / this.paginationNumber))
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
    // console.log(newPagTable)
  }
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  applyFilter(keyEvent, columnName: string) {

    if(columnName){    // use the original table
      this.currentTable = this.originalTableArray;
      // filtered elements is empty on method call
      this.filteredElements = [];
  
      // some helpers
      let filterString: string = keyEvent.target.value;
      filterString = filterString.toLowerCase();
      let colKey: number;
      let cols = Object.keys(this.currentTable[0])
  
      // find key of searched column
      for (let i = 0; i < cols.length; i++) {
        if (cols[i] == columnName) {
          colKey = i;
          break;
        }
      }
  
      // create a filteredElements array with rows that have matching items
      for (let i = 0; i < this.currentTable.length; i++) {
        let value: string = Object.values(this.currentTable[i])[colKey].toLowerCase();
  
        if (value.search(filterString) != -1) {
          this.filteredElements.push(this.currentTable[i])
        }
      }
  
      //  if there are matching items, assign them to the current table, if there arent any, asign the emptyTable
      if (this.filteredElements.length != 0) {
        this.currentTable = this.filteredElements;
      } else {
        this.currentTable = this.emptyTable;
      }
      this.initializeTable();
    }

  }

  setEmptyTable() {
    let cols = Object.keys(this.currentTable[0])
    let rowObject = {}
    var emptyTable: Array<Object> = []

    for (let i = 0; i < cols.length; i++) {
      let colname = cols[i]
      let cellEntry = ""
      rowObject[colname] = cellEntry
    } emptyTable.push(rowObject)

    this.emptyTable = emptyTable;
  }


}
