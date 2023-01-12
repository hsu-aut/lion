import { forkJoin, map, Observable, pipe } from "rxjs";

/**
 * @deprecated This wil soon be deleted.
 */
export class Tables {

    /**
     * @deprecated This wil soon be deleted.
     */
    buildTable(SPARQLReturn) {
        const heads = SPARQLReturn.head.vars;
        const data = SPARQLReturn.results.bindings;
        const table: Array<Record<string, any>> = [];

        // build empty table
        for (let row = 0; row < data.length; row++) {
            const rows = {};
            for (let head = 0; head < heads.length; head++) {
                const colname = heads[head];
                const cellEntry = "";
                rows[colname] = cellEntry;
            } table.push(rows);
        }
        // fill table with data
        for (const rowNumber in data) {
            for (const colName in data[rowNumber]) {
                table[rowNumber][colName] = data[rowNumber][colName].value;
            }
        }
        return table;
    }

    /**
     * @deprecated This wil soon be deleted.
     */
    buildList(SPARQLReturn, index){
        const head = SPARQLReturn.head.vars[index];
        const data = SPARQLReturn.results.bindings;
        const list: Array<string> = [];

        for (const i in data) {
            list[i] = data[i][head].value;
        }
        return list;

    }

    /**
     * @deprecated This wil soon be deleted.
     */
    concatListsToTable(colNames: Array<string>, listData: Array<Array<string>>){
        const table: Array<Record<string, any>> = [];
        const cols = colNames;
        const data = listData;
        let length = 0;

        // get max length
        for (let i = 0; i < data.length; i++) {
            if (data[i].length > length) { length = data[i].length; }
        }

        for (let i = 0; i < length; i++) {
            const row = {};
            for (let head = 0; head < cols.length; head++) {
                const colname = cols[head];
                const cellEntry = "";
                row[colname] = cellEntry;
            } table.push(row);
        }


        for (let i = 0; i < data.length; i++) {
            const colData = data[i];
            for (let ii = 0; ii < colData.length; ii++) {
                const key = Object.keys(table[ii])[i];
                table[ii][key] = colData[ii];
            }
        }

        return table;
    }

}

/**
 * Converts arrays of lists to one table 
 * @param lists
 * @param columnHeaders
 * @returns a table (<Array<Record<string,string>>)
 */ 
 export function concatListsToTable2(lists: Array<Observable<Array<string>>> , columnHeaders: Array<string>): Observable<Array<Record<string,string>>> {

    // check if arrays have the same length
    if (lists.length!=columnHeaders.length) {
        throw "number of lists has to be equal to number of column headers!";
    }

    // fork join observables
    const combinedVariableLists: Observable<Array<Array<string>>> = forkJoin(lists);

    //
    const tableObservable: Observable<Array<Record<string,string>>> = combinedVariableLists.pipe(map(variableLists => {
        //
        const tableArray = new Array<Record<string, string>>();
        // get max length
        let length = 0;
        for (let i = 0; i < variableLists.length; i++) {
            if (variableLists[i].length > length) { length = variableLists[i].length; }
        }
        //
        for (let i = 0; i < length; i++) {
            const row = {};
            for (let head = 0; head < columnHeaders.length; head++) {
                const colname = columnHeaders[head];
                const cellEntry = "";
                row[colname] = cellEntry;
            } tableArray.push(row);
        }
        //
        for (let i = 0; i < variableLists.length; i++) {
            const colData = variableLists[i];
            for (let ii = 0; ii < colData.length; ii++) {
                const key = Object.keys(tableArray[ii])[i];
                tableArray[ii][key] = colData[ii];
            }
        }
        return tableArray;
    }));

    return tableObservable;

}
