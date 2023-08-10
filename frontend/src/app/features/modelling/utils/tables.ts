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

}
