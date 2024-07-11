import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserInfoDto } from "@shared/models/user/UserInfoDto";
import { UserRouteService } from './user-route.service';
import { SetUserInfoDto } from '@shared/models/user/SetUserInfoDto';


@Controller("/lion_BE/user")
export class UserRouteController {

	constructor(
		private userRouteService: UserRouteService
	) { }

	@Get('/getUserInfo')
	getUserInfo(): Observable<UserInfoDto> {
		return this.userRouteService.getUserInfo();
	}

	@Post('/setUserInfo')
	setUserInfo(@Body()setUserInfoDto: SetUserInfoDto): Observable<void> {
		return this.userRouteService.setUserInfo(setUserInfoDto);
	}

}