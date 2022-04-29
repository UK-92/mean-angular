import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {
    if (typeof (control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const fileReaderObservable = new Observable((observer: Observer<{ [key: string]: any } | null>) => {
        fileReader.addEventListener("loadend", () => {
            const unitArray = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            for (let i = 0; i < unitArray.length; i++) {
                header += unitArray[i].toString(16);

            }
            let isValid = false;
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                case "ffd8ffee": // .jpg
                    isValid = true;
                    break;
                default:
                    isValid = false; // Or you can use the blob.type as fallback
                    break;
            }
            if (isValid) {
                observer.next(null); // return object anyway and work with returned object later
            } else {
                observer.next({ invalidMimeType: true });//next({ invalidMimeType: true });
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return fileReaderObservable;
};