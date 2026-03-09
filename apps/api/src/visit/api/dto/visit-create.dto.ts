import {UUID, VisitCreate, VisitStatus} from '@melluin/common';
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

    @ApiProperty({enum: [VisitStatus.DRAFT, VisitStatus.SCHEDULED]})
    @IsEnum(VisitStatus)
    @IsIn([VisitStatus.DRAFT, VisitStatus.SCHEDULED])
    status: VisitStatus;

    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: UUID;

    @ApiProperty()
    @IsBoolean()
    vicariousMomVisit: boolean;

}
