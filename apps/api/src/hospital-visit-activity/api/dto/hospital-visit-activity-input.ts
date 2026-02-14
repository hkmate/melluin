import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';


export class HospitalVisitActivityValidatedInput implements HospitalVisitActivityInput {

    @IsUUID('all', {each: true})
    children: Array<string>; // -> id of VisitedChild

    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @IsString()
    @IsOptional()
    comment: string;

    @IsUUID()
    @IsOptional()
    visitId?: string;

}

export class HospitalVisitActivityEditValidatedInput implements HospitalVisitActivityEditInput {

    @IsUUID()
    id: string;

    @IsUUID()
    @IsOptional()
    visitId?: string;

    @IsUUID('all', {each: true})
    children: Array<string>; // -> id of VisitedChild

    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @IsString()
    @IsOptional()
    comment: string;

}
