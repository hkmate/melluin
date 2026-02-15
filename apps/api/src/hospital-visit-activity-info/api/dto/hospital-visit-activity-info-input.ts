import {IsOptional, IsString} from 'class-validator';
import {HospitalVisitActivityInfoInput} from '@melluin/common';


export class HospitalVisitActivityInfoValidatedInput implements HospitalVisitActivityInfoInput {

    @IsString()
    @IsOptional()
    content?: string;

}

