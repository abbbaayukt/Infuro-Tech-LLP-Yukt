import { IsString, MinLength, MaxLength, Max } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username!: string;
    @IsString()
    @MaxLength(12)
    password!: string;
}