import {Injectable} from '@angular/core';
import * as xlsx from 'xlsx';
import {ElectronService} from 'ngx-electron';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    totalAreaData = {};
    totalData = [];
    result = {};

    constructor(public electron: ElectronService) {
    }

    getTotalTable() {
        return this.totalAreaData;
    }

    getJsonFromExcel(fileEvent) {
        const bstr = fileEvent.target.result;
        const wb = xlsx.read(bstr, {type: 'binary'});
        console.log(wb);
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        this.correctXLSRange(ws);
        const data = <any[]> xlsx.utils.sheet_to_json(ws, {header: 1});
        console.log(data);
        return data;
    }

    getParsedAreaData(excelFile: any, fileName: string) {
        console.log(excelFile);
        let data = this.getJsonFromExcel(excelFile);
        data = data.reduce((tot, row) => {
            if (row[0] && ((typeof row[0] === 'number'))) {
                row[0] = 0;
                row = row.filter(col => col != null);
                if (row.length < 3) {
                    row.splice(1, 0, tot[tot.length - 1][1]);
                }
                const areaName = fileName.split('.')[0].toUpperCase();
                row.push(areaName);
                row = this.getRowAsObject(row);
                tot.push(row);
            } else if (row[0] && row[0].trim() === 'Totali :') {
                const lastRow = tot[tot.length - 1];
                lastRow['TOTALE'] += row[row.length - 1];
                lastRow['TOTALE'] = Math.floor(lastRow['TOTALE'] * 100) / 100;
            }
            return tot;
        }, []);
        console.log(data);

        this.putInTotalAreaData(fileName, data);
    }

    getParsedTotalData(excelFile: any, fileName: string) {
        let data = this.getJsonFromExcel(excelFile);
        data = data.slice(3).map(function (row) {
            return [row[2], row[10]];
        });
        console.log(data);
        this.totalData = data;
    }

    putInTotalAreaData(fileName: string, data) {
        fileName = fileName.split('.')[0];
        while (this.totalAreaData.hasOwnProperty(fileName)) {
            fileName += 'b';
        }
        this.totalAreaData[fileName] = data;
        console.log(this.totalAreaData);
    }

    joinData() {
        const CFArray = this.totalData.map(row => row[0]);
        for (const area in this.totalAreaData) {
            this.totalAreaData[area].forEach(company => {
                const companyCF = company['C.F. / P.IVA'];
                const index = CFArray.indexOf(companyCF);
                if (index !== -1) {
                    if (!this.result[this.totalData[index][1]]) {
                        this.result[this.totalData[index][1]] = [];
                    }
                    this.result[this.totalData[index][1]].push(company);
                } else {
                    if (!this.result['NOELENCO']) {
                        this.result['NOELENCO'] = [];
                    }
                    this.result['NOELENCO'].push(company);
                }
            });
        }
        const path = this.electron.remote.dialog.showSaveDialog({title: 'Cartella Output', defaultPath: 'Nuova Cartella'});
        this.electron.ipcRenderer.sendSync('create-folder', path);
        let sheet, wb;
        for (const delegation in this.result) {
                sheet = {};
                sheet[delegation] = xlsx.utils.json_to_sheet(this.result[delegation]);
                this.correctXLSRange(sheet);
                console.log(sheet);
                wb = {SheetNames: [delegation], Sheets: sheet};
                console.log(wb);
                const content = xlsx.write(wb, { type: 'binary', bookType: 'xlsx', bookSST: false });
                this.electron.ipcRenderer.sendSync('write-file', [content, path, delegation]);
        }
        /*
        const sheet = xlsx.utils.json_to_sheet(this.result['NOELENCO']);
        const wb = {SheetNames: ['NOELENCO'], Sheets: {'NOELENCO': sheet}};
        xlsx.writeFile(wb, 'NOELENCO.xlsx');*/
        console.log(this.result);
    }

    getRowAsObject(row) {
        return {
            'COMUNE': row[3],
            'NOME': row[1],
            'C.F. / P.IVA': row[2],
            'TOTALE': row[0]
        };
    }

    correctXLSRange(ws) {
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
    }
}
