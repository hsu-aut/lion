import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Tables } from '../../../features/modelling/utils/tables';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent {

    // get table
    @Input() currentTable = new Array<Record<string, any>>();
    @Input() tableTitle: string;
    @Input() tableExplanation: string;
    @Input() filter: boolean;
    @Output() tableClickedRow = new EventEmitter<Array<Record<string, any>>>();
    @Output() tableClickedCell = new EventEmitter<string>();

    // util variables
    keys = Object.keys;
    TableUtil = new Tables();
    filterRow = "";

    // layout variables
    itemsPerPageOptions = [10, 20, 50, 100]
    itemsPerPage = this.itemsPerPageOptions[0];
    pagedTable: Array<Array<Record<string, any>>>;
    numberOfRows: number;
    numberOfPages: number;
    pages: Array<number> = [];
    currentPage = 0;
    originalTableArray: Array<Record<string, any>> = [];
    filteredElements: Array<Record<string, any>> = [];



    // TODO: Check what this is actually used for
    ngOnChanges(changes: SimpleChanges) {
        if (this.currentTable !== undefined) {

            if (this.currentTable.length != 0) {

                this.originalTableArray = this.currentTable;
                this.initializeTable();
            }
        }

    }


    initializeTable() {
        this.numberOfRows = this.currentTable.length;
        this.setPageCount();
        this.setPageArray();
    }

    tableClickRow(clickedRow: Array<Record<string, any>>) {
        this.tableClickedRow.emit(clickedRow);
    }
    tableClickCell(cleckedCell: string) {
        this.tableClickedCell.emit(cleckedCell);
    }

    setItemsPerPage(selectedNumber: number) {
        this.itemsPerPage = selectedNumber;
        this.setPageCount();
        this.setCurrentPage(0);
        this.setPageArray();
    }


    /**
     * Go to the next page by increasing the page number if it's not at numberOfPages already
     */
    nextPage(): void {
        if (this.currentPage < this.numberOfPages - 1) { this.currentPage++; }
    }

    /**
     * Go to the previous page by decreasing the page number if it's not at 0 already
     */
    previousPage(): void {
        if (this.currentPage > 0) { this.currentPage--; }
    }

    /**
     * Go to the first page by setting the page number to 0
     */
    firstPage(): void {
        this.currentPage = 0;
    }

    /**
     * Go to the last page by setting the page number to the number of pages
     */
    lastPage(): void {
        this.currentPage = this.numberOfPages - 1;
    }


    setPageCount(): void {
        this.pages = [];
        this.numberOfPages = Math.ceil(this.numberOfRows / this.itemsPerPage);
        for (let i = 0; i < this.numberOfPages; i++) {
            this.pages[i] = i + 1;
        }
    }

    setPageArray(): void {
        const newPagTable: Array<Array<Record<string, any>>> = [];
        let row = 0;

        for (let i = 0; i < this.numberOfPages; i++) {
            const pagedTableSlice: Array<Record<string, any>> = [];
            for (let ii = 0; ii < this.itemsPerPage; ii++) {
                if (this.currentTable[row] == undefined) { break; }
                pagedTableSlice[ii] = this.currentTable[row];
                row++;
            }
            newPagTable.push(pagedTableSlice);
        }
        this.pagedTable = newPagTable;
        // console.log(newPagTable)
    }

    setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    applyFilter(keyEvent, columnName: string) {

        if (columnName) {    // use the original table
            this.currentTable = this.originalTableArray;
            // filtered elements is empty on method call
            this.filteredElements = [];

            // some helpers
            let filterString: string = keyEvent.target.value;
            filterString = filterString.toLowerCase();
            let colKey: number;
            const cols = Object.keys(this.currentTable[0]);

            // find key of searched column
            for (let i = 0; i < cols.length; i++) {
                if (cols[i] == columnName) {
                    colKey = i;
                    break;
                }
            }

            // create a filteredElements array with rows that have matching items
            for (let i = 0; i < this.currentTable.length; i++) {
                const value: string = Object.values(this.currentTable[i])[colKey].toLowerCase();

                if (value.search(filterString) != -1) {
                    this.filteredElements.push(this.currentTable[i]);
                }
            }

            //  if there are matching items, assign them to the current table, if there arent any, asign the emptyTable
            if (this.filteredElements.length != 0) {
                this.currentTable = this.filteredElements;
            } else {
                this.currentTable = this.createEmptyTable();
            }
            this.initializeTable();
        }

    }

    createEmptyTable(): Array<Record<string, any>> {
        const cols = Object.keys(this.currentTable[0]);
        const rowObject = {};
        const emptyTable: Array<Record<string, any>> = [];

        for (let i = 0; i < cols.length; i++) {
            const colname = cols[i];
            const cellEntry = "";
            rowObject[colname] = cellEntry;
        } emptyTable.push(rowObject);

        return emptyTable;
    }


}
