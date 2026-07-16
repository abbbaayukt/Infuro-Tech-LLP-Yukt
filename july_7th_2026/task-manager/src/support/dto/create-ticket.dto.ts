import { IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}