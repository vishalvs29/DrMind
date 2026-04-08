import { Controller, Post, Body, UnauthorizedException, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    async signup(@Body() signUpDto: RegisterDto) {
        return this.authService.signup(signUpDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user and return JWT' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset email (Skeleton)' })
    async forgotPassword(@Body('email') email: string) {
        // TODO: Implement email service and token persistence
        return { message: 'If the email exists, a reset link will be sent.' };
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password using token (Skeleton)' })
    async resetPassword(@Body() data: any) {
        // TODO: Validate reset token and update password hashed
        return { message: 'Password reset successful.' };
    }
}
