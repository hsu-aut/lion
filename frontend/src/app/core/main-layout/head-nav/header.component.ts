import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/backEnd/user.service';
import { map } from 'rxjs';
import { UserInfoDto } from '@shared/models/user/UserInfoDto';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string;
    public userName = "---";
    public $userName;

    constructor(
        private userService: UserService,
        public router: Router,
        private authService: AuthService
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

    ngOnInit(): void {
        this.getUserName();
        // this.pushRightClass = 'push-right';
    }

    signOut(): void {
        this.authService.signOut();
        this.router.navigate(['']);
        return;
    }

    getUserName(): void {
        this.$userName =  this.userService.getCurrentUserInfo().pipe(map(
            (userInfo: UserInfoDto) => userInfo.username
        ));
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
