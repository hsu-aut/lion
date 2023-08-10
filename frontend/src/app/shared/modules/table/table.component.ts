import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export type ListData = {
    header: string
    entries: Array<string | number>,
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
    // Table data can either be object which is rendered using its keys, or an array of separate lists that need to be shown individualy

    originalTableData: Record<string, string | number>[];
    _tableData: Record<string, string | number>[];
    tableHeaders: string[];
    _listData: ListData[];
    listSelector = new FormControl<ListData>(null);

    @Input() set tableData(inputData: Array<Record<string, string | number>>) {
        this._tableData = inputData;
        this.originalTableData = this._tableData;
        this.tableHeaders = Object.keys(inputData[0] as Record<string, any>);
    }

    @Input() set listData(listData: ListData[]) {
        if(listData.length > 1) {
            this._listData = listData;
        }

        // select first entry as default
        const firstElement = listData[0];
        this._tableData = firstElement.entries.map(entry => {return {[firstElement.header]: entry};});
        this.tableHeaders = [firstElement.header];
        this.listSelector.setValue(firstElement);
    }

    @Output() tableClickedRow = new EventEmitter<Record<string, unknown>>();
    @Output() tableClickedCell = new EventEmitter<string>();


    filterForm = this.fb.group({
        columnName: this.fb.control("", Validators.required),
        filterCondition: this.fb.control("", Validators.required)
    })


    // layout variables
    itemsPerPageOptions = [10, 20, 50, 100]
    itemsPerPage = this.itemsPerPageOptions[0];
    numberOfPages: number;
    pages: Array<number> = [];
    currentPage = 0;

    constructor(
        private fb: FormBuilder
    ){}


    ngOnInit(): void {
        this.filterForm.valueChanges.subscribe((filterFormData) => this.applyFilter(filterFormData));
        this.listSelector.valueChanges.subscribe(newListData => this._tableData = newListData.entries.map(entry => {return {[newListData.header]: entry};}));
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
        return this._tableData.length;
    }

    get pagedTable(): Array<Record<string, any>> {
        const start = (this.currentPage) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this._tableData?.slice(start, end);
    }

    initializeTable() {
        this.setPageCount();
        this.setPageArray();
    }

    tableClickRow(clickedRow: Record<string, any>): void {
        console.log("click row");

        this.tableClickedRow.emit(clickedRow);
    }

    tableClickCell(clickedCell: string): void {
        console.log("click cell");
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
    //     const newPagTable: Array<Array<Record<string, any>>> = [];
    //     let row = 0;

    //     for (let i = 0; i < this.numberOfPages; i++) {
    //         const pagedTableSlice: Array<Record<string, any>> = [];
    //         for (let ii = 0; ii < this.itemsPerPage; ii++) {
    //             if (this.tableData[row] == undefined) { break; }
    //             pagedTableSlice[ii] = this.tableData[row];
    //             row++;
    //         }
    //         newPagTable.push(pagedTableSlice);
    //     }
    //     this.pagedTable = newPagTable;
    }

    setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    applyFilter(filterFormData: Partial<{columnName: string, filterCondition: string}>): void {
        const {columnName, filterCondition} = filterFormData;
        console.log("filter");


        if(!columnName) return;
        if(filterCondition == "") this._tableData = this.originalTableData;

        this._tableData = this.originalTableData.filter(entry => entry[columnName].toString().includes(filterCondition));
    }

    clearFilter(): void {
        this.filterForm.get('filterCondition').reset();
        this._tableData = this.originalTableData;
    }

}
