import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file/file.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(public fileService: FileService) {
    }

    ngOnInit() {
    }

    getLoadedAreaFiles() {
        return this.fileService.getLoadedAreaFiles();
    }

    loadAreaFiles(ev) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        this.fileService.loadFiles(ev);
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

    deleteAreaFile(fileName) {
        this.fileService.deleteAreaFile(fileName);
    }

    deleteAllAreaFiles() {
        this.fileService.deleteAllAreaFiles();
    }

}
