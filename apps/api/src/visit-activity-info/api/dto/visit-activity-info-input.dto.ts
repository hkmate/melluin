import {IsOptional, IsString} from 'class-validator';
import {VisitActivityInfoInput} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';


export class VisitActivityInfoDto implements VisitActivityInfoInput {

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    content?: string;

}

