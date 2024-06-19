import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './types/user-token';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.getUserByUsername(username);
        if (!user) throw new UnauthorizedException('Invalid username or password');
        await this.verifyPassword(password, user.password);

        const payload: UserToken = {
            id: user.id,
            username: user.username,
            email: user.email,
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return { accessToken }

    }

    private async verifyPassword(password: string, hashedPassword: string) {
        if (!password) throw new UnauthorizedException('Invalid username or password');

        const passwordMatch = await compare(password, hashedPassword);
        if (!passwordMatch) throw new UnauthorizedException('Invalid username or password');
    }
}
