import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../shared/services/backEnd/user.service';
import { Observable, map } from 'rxjs';
import { UserInfoDto } from '@shared/models/user/UserInfoDto';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string;
    public userName = "---";

    constructor(
        private userService: UserService,
        // private translate: TranslateService, 
        // public router: Router
    ) {

        // this.router.events.subscribe(val => {
        //     if (
        //         val instanceof NavigationEnd &&
        //         window.innerWidth <= 992 &&
        //         this.isToggled()
        //     ) {
        //         this.toggleSidebar();
        //     }
        // });
    }

    ngOnInit() {
        this.getUserName();
        // this.pushRightClass = 'push-right';
    }

    signOut(): void {
        console.error("not implemented yet");
        return;
    }

    getUserName(): void { 
        this.userService.getCurrentUserInfo().pipe(map(
            (userInfo: UserInfoDto) => userInfo.username
        )).subscribe({
            next: (userName: string) => { 
                this.userName = userName; 
            },
            error: (error: Error) => {
                this.userName = "---";
                console.error('No username received: ' + error);
            },
            complete: () => { return; }
        });
    }

    // isToggled(): boolean {
    //     const dom: Element = document.querySelector('body');
    //     return dom.classList.contains(this.pushRightClass);
    // }

    // toggleSidebar() {
    //     const dom: any = document.querySelector('body');
    //     dom.classList.toggle(this.pushRightClass);
    // }

    // rltAndLtr() {
    //     const dom: any = document.querySelector('body');
    //     dom.classList.toggle('rtl');
    // }

    // onLoggedout() {
    //     localStorage.removeItem('isLoggedin');
    // }

    // changeLang(language: string) {
    //     this.translate.use(language);
    // }
}
