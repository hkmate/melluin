import {UUID, VisitCreate, VisitStatus, VisitStatuses} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min
} from 'class-validator';


export class VisitCreateDto implements VisitCreate {

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
    @IsUUID()
    organizerId: UUID;

    @ApiProperty()
    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<UUID>;

    @ApiProperty({enum: [VisitStatuses.DRAFT, VisitStatuses.SCHEDULED]})
    @IsEnum(VisitStatuses)
    @IsIn([VisitStatuses.DRAFT, VisitStatuses.SCHEDULED])
    status: VisitStatus;

    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: UUID;

    @ApiProperty()
    @IsBoolean()
    vicariousMomVisit: boolean;

}
