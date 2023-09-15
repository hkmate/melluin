import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';


export class HospitalVisitActivityInput {

    @IsUUID('all', {each: true})
    children: Array<string>; // -> id of VisitedChild

    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @IsString()
    @IsOptional()
    comment: string;

    @IsOptional()
    visitId?: string;

}
