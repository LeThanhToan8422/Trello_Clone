import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  order: number;

  @IsUUID()
  boardId: string;
}

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsUUID()
  @IsOptional()
  boardId?: string;
}
