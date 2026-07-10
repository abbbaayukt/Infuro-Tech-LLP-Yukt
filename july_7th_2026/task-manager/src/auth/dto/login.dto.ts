import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(4)
    username!: string;
    @IsString()
    password!: string;
}