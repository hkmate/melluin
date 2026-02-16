import {EventVisibility, HospitalVisitRewrite, HospitalVisitStatus} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min} from 'class-validator';


export class HospitalVisitRewriteDto implements HospitalVisitRewrite {

    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsDateString()
    dateTimeFrom: string;

    @ApiProperty()
    @IsDateString()
    dateTimeTo: string;

    @ApiProperty({required: false})
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsOptional()
    countedMinutes?: number;

    @ApiProperty()
    @IsEnum(EventVisibility)
    visibility: EventVisibility;

    @ApiProperty()
    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

    @ApiProperty({enum: HospitalVisitStatus, enumName: 'HospitalVisitStatus'})
    @IsEnum(HospitalVisitStatus)
    status: HospitalVisitStatus;

    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: string;

    @ApiProperty()
    @IsBoolean()
    vicariousMomVisit: boolean;

}
