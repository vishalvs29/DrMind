import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class CreateMoodDto {
    @IsInt()
    @Min(1)
    @Max(5)
    level: number;

    @IsString()
    @IsOptional()
    note?: string;
}
