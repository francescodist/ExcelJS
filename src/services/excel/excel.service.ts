import {Injectable} from '@angular/core';
import * as xlsx from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    totalTable: any[] = [];

    constructor() {
    }

    getTotalTable() {
        return this.totalTable;
    }

    getJsonFromExcel(fileEvent) {
        const bstr = fileEvent.target.result;
        const wb = xlsx.read(bstr, {type: 'binary'});

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // corrects file range to avoid excessive memory usage ////////////
        const range = {s: {r: 20000000, c: 20000000}, e: {r: 0, c: 0}};
        Object.keys(ws).filter(function (x) {
            return x.charAt(0) !== '!';
        })
            .map(xlsx.utils.decode_cell).forEach(function (x) {
            range.s.c = Math.min(range.s.c, x.c);
            range.s.r = Math.min(range.s.r, x.r);
            range.e.c = Math.max(range.e.c, x.c);
            range.e.r = Math.max(range.e.r, x.r);
        });
        ws['!ref'] = xlsx.utils.encode_range(range);
        /////////////////////////////////////////////////////////////////
        let data = <any[]> xlsx.utils.sheet_to_json(ws, {header: 1});
        console.log(data);
        // const headers = data.shift();
        //  console.log(headers);
        // data = data.map(row => {
//                            return row.reduce((obj, item, index) => {

        //                              const key = headers[index];
        //                            obj[key.trim()] = item;
        //                          const exceljs = obj;
//
        //                            return exceljs;
        //                          }, {});
        //                  });
        data = data.reduce((tot, row) => {
            if (row[0] && ((typeof row[0] === 'number'))) {
                row[0] = 0;
                row = row.filter(col => col != null);
                if (row.length < 3) {
                    row.splice(1, 0, tot[tot.length - 1][1]);
                }
                tot.push(row);
            } else if (row[0] && row[0].trim() === 'Totali :') {
                const lastRow = tot[tot.length - 1];
                lastRow[0] += row[row.length - 1];
                lastRow[0] = Math.floor(lastRow[0] * 100) / 100;
            }
            return tot;
        }, []);
        console.log(data);
    }
}
