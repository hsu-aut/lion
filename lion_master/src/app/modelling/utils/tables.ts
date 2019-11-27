
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

    concatListsToTable(colNames: Array<string>, listData: Array<Array<string>>){
        var table: Array<Object> = []
        let cols = colNames;
        let data = listData;
        let length = 0;

        // get max length
        for (let i = 0; i < data.length; i++) {
          if (data[i].length > length) { length = data[i].length }
        }
    
        for (let i = 0; i < length; i++) {
          let row = {}
          for (let head = 0; head < cols.length; head++) {
            let colname = cols[head]
            let cellEntry = ""
            row[colname] = cellEntry
          } table.push(row)
        }

    
        for (let i = 0; i < data.length; i++) {
          let colData = data[i];
          for (let ii = 0; ii < colData.length; ii++) {
            let key = Object.keys(table[ii])[i]
            table[ii][key] = colData[ii];
          }
        }

        return table
    }


}