import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfoDto } from "@shared/models/user/UserInfoDto";
import { Observable, of } from "rxjs";
// import { MessagesService } from "../messages.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
        // private messageService: MessagesService
    ) {

    }

    getCurrentUserInfo(): Observable<UserInfoDto> {
        return this.http.get<UserInfoDto>('lion_BE/user/getUserInfo');
    }

}