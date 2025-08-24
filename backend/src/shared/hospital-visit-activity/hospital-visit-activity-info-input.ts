import {IsOptional, IsString} from 'class-validator';


export class HospitalVisitActivityInfoInput {

    @IsString()
    @IsOptional()
    content?: string;

}

