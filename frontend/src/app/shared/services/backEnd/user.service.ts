import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfoDto } from "@shared/models/user/UserInfoDto";
import { Observable, of } from "rxjs";
import { SetUserInfoDto } from "@shared/models/user/SetUserInfoDto";
// import { MessagesService } from "../messages.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
    ) {

    }

    getCurrentUserInfo(): Observable<UserInfoDto> {
        return this.http.get<UserInfoDto>('lion_BE/user/getUserInfo');
    }

    setCurrentUserInfo(setuserInfoDto: SetUserInfoDto): Observable<void> {
        return this.http.post<void>('lion_BE/user/setUserInfo', setuserInfoDto);
    }

}