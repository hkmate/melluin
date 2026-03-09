import {UUID, VisitRewrite, VisitStatus} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min} from 'class-validator';


export class VisitRewriteDto implements VisitRewrite {

    @ApiProperty()
    @IsUUID()
    id: UUID;

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
    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<UUID>;

    @ApiProperty({enum: VisitStatus, enumName: 'VisitStatus'})
    @IsEnum(VisitStatus)
    status: VisitStatus;

    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: UUID;

    @ApiProperty()
    @IsBoolean()
    vicariousMomVisit: boolean;

}
