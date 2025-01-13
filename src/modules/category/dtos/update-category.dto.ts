import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Action/Adventure',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Category name must not be empty.' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(100)
  name?: string;
}
