import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Tables } from '../../../features/modelling/utils/tables';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

type TableData = {
    headers: string[]
    rows: Array<Record<string, any>>,
}

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent {

    @Input() tableTitle: string;
    @Input() tableExplanation: string;
    @Input() showFilter: boolean;
    // Table data can either be object which is rendered using its keys, or explicitly set headers and rows

    _currentTable: Array<Record<string, any>> | TableData

    @Input() set currentTable(data: Array<Record<string, any>> | TableData) {
        console.log(data);

        const length = (data as TableData)?.rows?.length ?? (data as Record<string, any>[])?.length;
        if(data == null || length == 0) return;

        this._currentTable = data;
        this.pagedTable = (this._currentTable as Array<Record<string, any>>).slice(0, this.itemsPerPageOptions[0])
        ?? (this._currentTable as TableData).rows.slice(0, this.itemsPerPageOptions[0]);
    }

    @Output() tableClickedRow = new EventEmitter<Record<string, unknown>>();
    @Output() tableClickedCell = new EventEmitter<string>();

    // util variables
    TableUtil = new Tables();

    filterForm = this.fb.group({
        columnName: this.fb.control("", Validators.required),
        filterCondition: this.fb.control("", Validators.required)
    })


    // layout variables
    itemsPerPageOptions = [10, 20, 50, 100]
    itemsPerPage = this.itemsPerPageOptions[0];
    pagedTable: Array<Record<string, any>> | TableData
    numberOfPages: number;
    pages: Array<number> = [];
    currentPage = 0;
    originalTableArray: Array<Record<string, unknown>> | TableData;
    filteredTable: Array<Record<string, unknown>> | TableData;

    constructor(
        private fb: FormBuilder
    ){}


    ngOnInit(): void {
        this.filterForm.get('filterCondition').valueChanges.pipe(debounceTime(100)).subscribe(() => this.applyFilter());
    }

    // TODO: Check what this is actually used for
    // ngOnChanges(changes: SimpleChanges) {
    //     if (this.currentTable !== undefined) {

    //         if (this.numberOfRows != 0) {

    //             this.originalTableArray = this.currentTable;
    //             this.initializeTable();
    //         }
    //     }

    // }

    get numberOfRows(): number {
        return (this._currentTable as TableData)?.rows?.length ?? (this._currentTable as Record<string, any>[])?.length;
    }

    get tableKeys(): string[] {
        return (this._currentTable as TableData)?.headers ?? Object.keys(this._currentTable[0] as Record<string, any>);
    }

    initializeTable() {
        this.setPageCount();
        this.setPageArray();
    }

    tableClickRow(clickedRow: Record<string, any>): void {
        this.tableClickedRow.emit(clickedRow);
    }

    tableClickCell(clickedCell: string): void {
        this.tableClickedCell.emit(clickedCell);
    }

    setItemsPerPage(selectedNumber: number) {
        this.itemsPerPage = selectedNumber;
        this.setPageCount();
        this.setCurrentPage(0);
        this.setPageArray();
    }


    /**
     * Pagination: Go to the next page
     */
    nextPage(): void {
        if (this.currentPage < this.numberOfPages - 1) { this.currentPage++; }
    }

    /**
     * Pagination: Go to the previous page
     */
    previousPage(): void {
        if (this.currentPage > 0) { this.currentPage--; }
    }

    /**
     * Pagination: Go to the first page by setting the page number to 0
     */
    firstPage(): void {
        this.currentPage = 0;
    }

    /**
     * Pagination: Go to the last page by setting the page number to the number of pages
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
                if (this._currentTable[row] == undefined) { break; }
                pagedTableSlice[ii] = this._currentTable[row];
                row++;
            }
            newPagTable.push(pagedTableSlice);
        }
        this.pagedTable = newPagTable;
    }

    setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    applyFilter(): void {
        const {columnName, filterCondition} = this.filterForm.value;

        if(!columnName) return;

        const tableEntries = ((this._currentTable as TableData).rows ?? this._currentTable) as Array<Record<string, unknown>>;

        this.filteredTable = tableEntries.filter(entry => {
            const filterTrue = eval(`${entry[columnName]} ${filterCondition}`);
            return filterTrue;
        });

        // this._currentTable = this.originalTableArray;
        // // filtered elements is empty on method call
        // this.filteredElements = {};

        // let colKey: number;
        // const cols = Object.keys(this._currentTable[0]);

        // // find key of searched column
        // for (let i = 0; i < cols.length; i++) {
        //     if (cols[i] == columnName) {
        //         colKey = i;
        //         break;
        //     }
        // }

        // // create a filteredElements array with rows that have matching items
        // for (let i = 0; i < this.numberOfRows; i++) {
        //     const value: string = Object.values(this.currentTable[i])[colKey].toLowerCase();

        //     if (value.search(filterString) != -1) {
        //         // this.filteredElements.push(this._currentTable[i]);
        //     }
        // }

        // //  if there are matching items, assign them to the current table, if there arent any, asign the emptyTable
        // if (this.filteredElements.length != 0) {
        //     this._currentTable = this.filteredElements;
        // } else {
        //     // this._currentTable = this.createEmptyTable();
        // }
        // this.initializeTable();

    }

    // createEmptyTable(): Record<string, any> {
    //     const cols = Object.keys(this._currentTable[0]);
    //     const rowObject = {};
    //     const emptyTable: Array<Record<string, any>> = [];

    //     for (let i = 0; i < cols.length; i++) {
    //         const colname = cols[i];
    //         const cellEntry = "";
    //         rowObject[colname] = cellEntry;
    //     } emptyTable.push(rowObject);

    //     return emptyTable;
    // }


}
