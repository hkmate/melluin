import {IsOptional, IsString} from 'class-validator';
import {HospitalVisitActivityInfoInput} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';


export class HospitalVisitActivityInfoDto implements HospitalVisitActivityInfoInput {

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    content?: string;

}

