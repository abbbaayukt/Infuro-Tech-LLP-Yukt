import { IsString, MinLength, IsNotEmpty, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    tenant!: string;
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username!: string;
    @IsString()
    @MaxLength(12)
    password!: string;
}