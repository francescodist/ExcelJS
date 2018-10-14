import {Injectable} from '@angular/core';
import {ExcelService} from '../excel/excel.service';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private loadedAreaFiles: any[] = [];
    private loadedTotalFile: any;

    constructor(public excelService: ExcelService) {
    }

    getLoadedAreaFiles() {
        return this.loadedAreaFiles;
    }

    getLoadedTotalFile() {
        return this.loadedTotalFile;
    }


    loadFiles(loadFileEvent) {
        const loadedFiles: any[] = loadFileEvent.dataTransfer ?
            (loadFileEvent.dataTransfer.items ?
                loadFileEvent.dataTransfer.items : loadFileEvent.dataTransfer.files) : loadFileEvent.target.files;
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < loadedFiles.length; i++) {
            // If dropped items aren't files, reject them
            if (loadedFiles[i].kind === 'file') {
                const file = loadedFiles[i].getAsFile();
                this.readFileAsBinaryString(file);
            } else if (!loadFileEvent.dataTransfer) {
                this.readFileAsBinaryString(loadedFiles[i]);
            }
        }

        // Pass event to removeDragData for cleanup
        this.removeDragData(loadFileEvent);
    }

    loadTotalFile(loadFileEvent) {
        const loadedFiles: any[] = loadFileEvent.dataTransfer ?
            (loadFileEvent.dataTransfer.items ?
                loadFileEvent.dataTransfer.items : loadFileEvent.dataTransfer.files) : loadFileEvent.target.files;
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < loadedFiles.length; i++) {
            // If dropped items aren't files, reject them
            if (loadedFiles[i].kind === 'file') {
                const file = loadedFiles[i].getAsFile();
                this.readTotalFileAsBinaryString(file);
            } else if (!loadFileEvent.dataTransfer) {
                this.readTotalFileAsBinaryString(loadedFiles[i]);
            }
        }

        // Pass event to removeDragData for cleanup
        this.removeDragData(loadFileEvent);
    }

    private readFileAsBinaryString(file) {
        file.isLoading = true;
        this.loadedAreaFiles.push(file);
        const i = this.loadedAreaFiles.length - 1;
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const parsedAreaData = this.excelService.getParsedAreaData(e, file.name);
            if (parsedAreaData === 0) {
                const index = this.loadedAreaFiles.indexOf(file);
                if (index !== -1) {
                    this.loadedAreaFiles.splice(index, 1);
                }
            } else if (this.loadedAreaFiles.indexOf(file.name) !== i) {
                file.isDouble = true;
            }
            file.nameId = parsedAreaData;
            file.isLoading = false;

        };
        reader.readAsBinaryString(file);
    }

    private readTotalFileAsBinaryString(file) {
        file.isLoading = true;
        this.loadedTotalFile = file;
        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (this.excelService.getParsedTotalData(e, file.name) === 0) {
                    this.loadedTotalFile = null;
                }
                file.isLoading = false;
            };
            reader.readAsBinaryString(file);
        }, 500);
    }

    private removeDragData(ev) {
        if (ev.dataTransfer) {
            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to remove the drag data
                ev.dataTransfer.items.clear();
            } else {
                // Use DataTransfer interface to remove the drag data
                ev.dataTransfer.clearData();
            }
        }

    }

    deleteAreaFile(fileNameId, index) {
        this.loadedAreaFiles.splice(index, 1);
        console.log(fileNameId);
        console.log(this.excelService.totalAreaData);
        delete this.excelService.totalAreaData[fileNameId];
        console.log(this.excelService.totalAreaData);
    }

    deleteAllAreaFiles() {
        this.loadedAreaFiles = [];
        this.excelService.totalAreaData = {};
    }

    deleteTotalFile() {
        this.loadedTotalFile = undefined;
        this.excelService.totalData = [];
    }
}
