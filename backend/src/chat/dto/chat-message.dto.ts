import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
    @ApiProperty({ example: 'I am feeling a bit anxious today.', description: 'The user chat input message' })
    @IsString()
    @MaxLength(2000, { message: 'Message is too long. Maximum 2000 characters allowed.' })
    text: string;
}
