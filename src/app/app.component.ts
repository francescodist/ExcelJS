import {Component} from '@angular/core';
import * as xlsx from 'xlsx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';

    constructor() {

    }

    dropHandler(ev) {
        console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {

                    const file = ev.dataTransfer.items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        const bstr = e.target.result;
                        const wb = xlsx.read(bstr, {type: 'binary'});

                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        let data = <any[]> xlsx.utils.sheet_to_json(ws, {header: 1});
                        const headers = data.shift();
                        console.log(headers);
                        data = data.map(row => {
                            return row.reduce((obj, item, index) => {

                                const key = headers[index];
                                obj[key.trim()] = item;
                                const exceljs = obj;

                                return exceljs;
                            }, {});
                        });
                        console.log(data);
                    };
                    reader.readAsBinaryString(file);
                    console.log('... file[' + i + '].name = ' + file.name);
                    console.log(file);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
                console.log(ev.dataTransfer.files[i]);
            }
        }

        // Pass event to removeDragData for cleanup
        this.removeDragData(ev);
    }

    dragOverHandler(ev) {
        console.log('File(s) in drop zone');
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    removeDragData(ev) {
        console.log('Removing drag data');

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            ev.dataTransfer.items.clear();
        } else {
            // Use DataTransfer interface to remove the drag data
            ev.dataTransfer.clearData();
        }
    }
}
