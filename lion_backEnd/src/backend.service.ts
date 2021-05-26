import { Injectable } from '@nestjs/common';

@Injectable()
export class BackendService {
  getHello(): string {
    return 'Hello World!';
  }
}
