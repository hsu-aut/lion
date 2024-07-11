import { Observable, from, map, mergeMap} from 'rxjs';
import { UserInfoDto } from "@shared/models/user/UserInfoDto";
import { SetUserInfoDto } from "@shared/models/user/SetUserInfoDto";
import { CurrentUserService } from '../../shared-services/current-user.service';
import { UserDocument } from '../../users/user.schema';
import { UserInfo, UserInfoDocument } from '../../users/user-data/user-info.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class UserRouteService { 

	constructor(
		private currentUserService: CurrentUserService,
		@InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
	) {}

	getUserInfo(): Observable<UserInfoDto> {
		return this.currentUserService.getCurrentUser().pipe(
			mergeMap((user: UserDocument) => from(user.populate('userInfo'))),
			map((user: UserDocument) => {
				const userInfoDto: UserInfoDto = {
					username: user.username,
					firstName: user.userInfo && user.userInfo.firstName ? user.userInfo.firstName : undefined,
					lastName: user.userInfo && user.userInfo.lastName ? user.userInfo.lastName : undefined,
				};
				return userInfoDto;
			})
		);
	}
	
	setUserInfo(setUserInfoDto: SetUserInfoDto): Observable<void> {
		return this.currentUserService.getCurrentUser().pipe(
			mergeMap((user: UserDocument) => from(user.populate('userInfo'))),
			mergeMap((user: UserDocument) => {
				if (!user.userInfo) {
					const newUserInfo: Observable<UserInfoDocument> = from(new this.userInfoModel({ 
						firstName: setUserInfoDto.firstName, 
						lastName: setUserInfoDto.lastName,
					}).save());
					return newUserInfo.pipe(mergeMap((newUserInfo: UserInfoDocument) => {
						user.userInfo = newUserInfo;
						return from(user.save());
					}));
				}
				else {
					if (setUserInfoDto.firstName) user.userInfo.firstName = setUserInfoDto.firstName;
					if (setUserInfoDto.lastName) user.userInfo.lastName = setUserInfoDto.lastName;
					return from((user.userInfo as UserInfoDocument).save());
				}
			}),
			//map to void
			map(( ) => { return; })
		);
	}

}
