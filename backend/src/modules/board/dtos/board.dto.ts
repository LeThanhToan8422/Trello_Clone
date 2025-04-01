import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { List } from '../../list/entities/list.entity';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsNotEmpty()
  userId?: string;

  @IsArray()
  @IsOptional()
  lists?: List[];
}

export class UpdateBoardDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsOptional()
  lists?: List[];
}
