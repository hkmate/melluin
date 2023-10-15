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

    @IsUUID()
    @IsOptional()
    visitId?: string;

}

export class HospitalVisitActivityEditInput {

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
