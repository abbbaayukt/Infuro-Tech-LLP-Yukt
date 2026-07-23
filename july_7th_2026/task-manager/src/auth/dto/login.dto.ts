import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    tenant!: string;
    @IsString()
    @MinLength(4)
    username!: string;
    @IsString()
    password!: string;
}