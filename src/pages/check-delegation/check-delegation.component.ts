import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file/file.service';
import {ExcelService} from '../../services/excel/excel.service';
import {Location} from '@angular/common';

@Component({
    selector: 'app-check-delegation',
    templateUrl: './check-delegation.component.html',
    styleUrls: ['./check-delegation.component.scss']
})
export class CheckDelegationComponent implements OnInit {

    isLoading: boolean;

    constructor(public fileService: FileService, public excelService: ExcelService, private location: Location) {
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
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }


    openFileInput() {
        const fileInput = <HTMLElement> document.querySelector('#fileInput');
        fileInput.click();
    }

    joinData() {
        this.isLoading = true;
        this.excelService.joinData();
        this.isLoading = false;
    }


    deleteTotalFile () {
        this.fileService.deleteTotalFile();
    }

    backClicked() {
        this.location.back();
    }

}
