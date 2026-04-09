import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

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
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request a password reset email via Supabase Auth' })
    @ApiBody({ schema: { properties: { email: { type: 'string', example: 'user@example.com' } } } })
    async forgotPassword(@Body('email') email: string) {
        // Always returns the same message to prevent email enumeration
        await this.authService.forgotPassword(email);
        return { message: 'If the email exists, a reset link will be sent.' };
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password using Supabase access token from email link' })
    @ApiBody({
        schema: {
            properties: {
                accessToken: { type: 'string', description: 'Token from the Supabase reset email link' },
                newPassword: { type: 'string', description: 'The new password to set' }
            }
        }
    })
    async resetPassword(@Body() data: { accessToken: string; newPassword: string }) {
        await this.authService.resetPassword(data.accessToken, data.newPassword);
        return { message: 'Password has been successfully updated.' };
    }
}
