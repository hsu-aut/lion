
export class Tables {

    public paginationValues: Array<number> = [10, 20, 50, 100]
    public defaultPaginationIndex: number = 1;

    buildTable(SPARQLReturn) {
        var heads = SPARQLReturn.head.vars
        var data = SPARQLReturn.results.bindings
        var table: Array<Object> = []

        // build empty table
        for (let row = 0; row < data.length; row++) {
            let rows = {}
            for (let head = 0; head < heads.length; head++) {
                let colname = heads[head]
                let cellEntry = ""
                rows[colname] = cellEntry
            } table.push(rows)
        }
        // fill table with data
        for (const rowNumber in data) {
            for (const colName in data[rowNumber]) {
                table[rowNumber][colName] = data[rowNumber][colName].value
            }
        }
        return table
    }

    buildList(SPARQLReturn, index){
        var head = SPARQLReturn.head.vars[index];
        var data = SPARQLReturn.results.bindings
        var list: Array<string> = [];

        for (const i in data) {
            list[i] = data[i][head].value   
        }
        return list;

    }


}