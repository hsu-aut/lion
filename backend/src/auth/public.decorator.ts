import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * decorator to identify public routes that are also accessible by not authenthicated users
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);