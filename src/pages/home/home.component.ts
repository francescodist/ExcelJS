import {Component, OnInit} from '@angular/core';
import {FileService} from '../../services/file/file.service';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(public fileService: FileService, public router: Router,
                public electron: ElectronService) {
    }

    ngOnInit() {
    }

    getLoadedAreaFiles() {
        return this.fileService.getLoadedAreaFiles();
    }

    loadAreaFiles(ev) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        setTimeout(() => {
            this.fileService.loadFiles(ev);
        }, 200);

    }

    dragOverHandler(ev) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }


    openFileInput() {
        const fileInput = <HTMLElement> document.querySelector('#fileInput');
        fileInput.click();
    }

    deleteAreaFile(fileNameId, i) {
        this.fileService.deleteAreaFile(fileNameId, i);
    };

    deleteAllAreaFiles() {
        this.fileService.deleteAllAreaFiles();
        var fileInput = (<HTMLInputElement>document.getElementById('fileInput'));
        fileInput.value = null;
    }

    isSomeFileLoading() {
        return this.getLoadedAreaFiles()
            .filter(file => file.isLoading)
            .length > 0;
    }

    isDouble(fileName, i) {
        return this.getLoadedAreaFiles()
            .map(file => file.name)
            .indexOf(fileName) !== i;
    }

    isAnyFileDouble() {
        return this.getLoadedAreaFiles()
            .filter((file, index) => this.isDouble(file.name, index))
            .length > 0;
    }

    goToCheckDelegation() {
        if (!this.isAnyFileDouble()) {
            this.router.navigate(['/check-delegation']);
        } else {
            const answer = this.electron.ipcRenderer
                .sendSync('double-files', []);
            switch (answer) {
                case 0:
                    this.getLoadedAreaFiles().map((file, i) => {
                        if (this.isDouble(file.name, i)) {
                            this.deleteAreaFile(file.nameId, i);
                        }
                    });
                case 1:
                    this.router.navigate(['/check-delegation']);
                case 2:
            }
        }
    }

}
