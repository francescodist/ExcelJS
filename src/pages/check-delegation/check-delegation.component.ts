import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file/file.service';
import {ExcelService} from '../../services/excel/excel.service';

@Component({
    selector: 'app-check-delegation',
    templateUrl: './check-delegation.component.html',
    styleUrls: ['./check-delegation.component.scss']
})
export class CheckDelegationComponent implements OnInit {

    constructor(public fileService: FileService, public excelService: ExcelService) {
    }

    ngOnInit() {
    }

    getLoadedAreaFiles() {
        return this.fileService.getLoadedAreaFiles();
    }

    getLoadedTotalFile() {
        return this.fileService.getLoadedTotalFile();
    }

    loadTotalFile(ev) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        this.fileService.loadTotalFile(ev);
    }

    dragOverHandler(ev) {
        console.log('File(s) in drop zone');
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }


    openFileInput() {
        const fileInput = <HTMLElement> document.querySelector('#fileInput');
        fileInput.click();
    }

    joinData() {
        this.excelService.joinData();
    }

    deleteAreaFile(fileName) {
        this.fileService.deleteAreaFile(fileName);
    }

    deleteAllAreaFiles() {
        this.fileService.deleteAllAreaFiles();
    }

    deleteTotalFile () {
        this.fileService.deleteTotalFile();
        var fileInput = (<HTMLInputElement>document.getElementById('fileInput'));
        fileInput.value = null;
    }

}
