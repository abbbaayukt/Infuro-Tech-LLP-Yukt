import { IsOptional } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  title?: string;
  @IsOptional()
  completed?: boolean;
}