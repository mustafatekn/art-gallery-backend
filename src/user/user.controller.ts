import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':username')
    @HttpCode(HttpStatus.OK)
    getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }
}
