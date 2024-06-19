import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class ImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsString()
    description: string;
}

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: Array<ImageDto>

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ImageDto)
    thumbnail: ImageDto;
}