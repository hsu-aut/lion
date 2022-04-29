import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OdpInfo, OdpName } from "@shared/models/odps/odp";

@Injectable({
    providedIn: 'root'
})
export class OdpService {
    private apiUrl = 'lion_BE/odps';

    constructor(
        private http: HttpClient
    ) {}

    getAllOdps(): Observable<Array<OdpInfo>> {
        return this.http.get<Array<OdpInfo>>(this.apiUrl);
    }


    loadOdpIntoRepository(odpName: OdpName, version: string) {
        const url = this.apiUrl + "/" + odpName;
        const queryParams = {
            version: version
        };

        return this.http.get(url, {params: queryParams});
    }

}
