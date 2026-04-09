import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private supabase;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        const url = this.configService.get<string>('SUPABASE_URL');
        const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (url && key) {
            this.supabase = createClient(url, key, {
                auth: { autoRefreshToken: false, persistSession: false }
            });
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        };
    }

    async signup(data: any) {
        const user = await this.usersService.create(data);
        return this.login(user);
    }

    async forgotPassword(email: string): Promise<void> {
        if (!this.supabase) {
            throw new BadRequestException('Password reset is not configured. Contact support.');
        }
        // Supabase handles token generation, expiry enforcement, and email delivery.
        const redirectTo = this.configService.get<string>('PASSWORD_RESET_REDIRECT_URL') ||
            'https://app.drmind.io/reset-password';

        const { error } = await this.supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) {
            // Log internally but don't leak whether the email exists
            console.error('Supabase resetPasswordForEmail error:', error.message);
        }
        // Always return success to avoid email enumeration attacks
    }

    async resetPassword(accessToken: string, newPassword: string): Promise<void> {
        if (!this.supabase) {
            throw new BadRequestException('Password reset is not configured. Contact support.');
        }
        if (!accessToken || !newPassword) {
            throw new BadRequestException('Access token and new password are required.');
        }

        // Validate the token and get the user identity from Supabase
        const { data: { user }, error: userError } = await this.supabase.auth.getUser(accessToken);
        if (userError || !user?.email) {
            throw new UnauthorizedException('Reset token is invalid or has expired.');
        }

        // Hash and persist the new password in our own Prisma DB
        const hashed = await bcrypt.hash(newPassword, 12);
        const existingUser = await this.usersService.findOne(user.email);
        if (!existingUser) {
            throw new UnauthorizedException('User account not found.');
        }
        await this.usersService.updatePassword(existingUser.id, hashed);
    }
}
