import {IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested} from 'class-validator';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {Type} from 'class-transformer';


export class ActivityChildInfo {

    @IsUUID()
    childId: string;

    @IsBoolean()
    isParentThere: boolean;

}

export class HospitalVisitActivityInput {

    @ValidateNested({each: true})
    @Type(() => ActivityChildInfo)
    children: Array<ActivityChildInfo>;

    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @IsString()
    @IsOptional()
    comment: string;

    @IsOptional()
    visitId: string;

}
