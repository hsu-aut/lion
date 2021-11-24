
export class Tables {

    public paginationValues: Array<number> = [10, 20, 50, 100]
    public defaultPaginationIndex = 1;

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

    buildList(SPARQLReturn, index){
        const head = SPARQLReturn.head.vars[index];
        const data = SPARQLReturn.results.bindings;
        const list: Array<string> = [];

        for (const i in data) {
            list[i] = data[i][head].value;   
        }
        return list;

    }

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