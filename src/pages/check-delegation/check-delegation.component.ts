import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file/file.service';

@Component({
    selector: 'app-check-delegation',
    templateUrl: './check-delegation.component.html',
    styleUrls: ['./check-delegation.component.scss']
})
export class CheckDelegationComponent implements OnInit {

    constructor(public fileService: FileService) {
    }

    ngOnInit() {
    }

    getLoadedAreaFiles() {
        return this.fileService.getLoadedAreaFiles();
    }

    getLoadedTotalFile() {
        return this.fileService.getLoadedTotalFile();
    }

    loadAreaFiles(ev) {
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

}
