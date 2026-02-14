import {IsOptional, IsString} from 'class-validator';
import {HospitalVisitActivityInfoInput} from '@shared/hospital-visit-activity/hospital-visit-activity-info-input';


export class HospitalVisitActivityInfoValidatedInput implements HospitalVisitActivityInfoInput {

    @IsString()
    @IsOptional()
    content?: string;

}

