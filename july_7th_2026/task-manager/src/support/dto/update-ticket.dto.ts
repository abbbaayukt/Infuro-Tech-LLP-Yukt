import { IsString, IsOptional } from 'class-validator';
export class UpdateTicketDto {
    @IsString()
    title?: string;
    
    @IsOptional()
    @IsString()
    description?: string;
}