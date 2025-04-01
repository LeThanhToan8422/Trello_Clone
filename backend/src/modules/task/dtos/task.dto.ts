import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LabelDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  listId: string;

  @IsUUID()
  boardId: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LabelDto)
  label?: LabelDto;

  @IsNumber()
  order: number;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  listId?: string;

  @IsUUID()
  @IsOptional()
  boardId?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LabelDto)
  label?: LabelDto;

  @IsNumber()
  @IsOptional()
  order?: number;
}
