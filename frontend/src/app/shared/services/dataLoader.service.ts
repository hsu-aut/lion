import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataLoaderService {

    constructor() { }

private _loading = 0;
loadingStatus: Subject<number> = new Subject();

get loading(): number {
    return this._loading;
}

set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
}

startLoading() {
    this.loading++;
}

stopLoading() {
    this.loading--;
    if(this.loading < 0){
        this.loading = 0;
    }
}
}
