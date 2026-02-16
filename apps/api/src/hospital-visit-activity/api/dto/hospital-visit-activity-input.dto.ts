import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput,
    VisitActivityType
} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';


export class HospitalVisitActivityDto implements HospitalVisitActivityInput {

    @ApiProperty({type: [String]})
    @IsUUID('all', {each: true})
    children: Array<string>; // -> id of VisitedChild

    @ApiProperty({enum: VisitActivityType, isArray: true})
    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment: string;

    @ApiProperty({required: false})
    @IsUUID()
    @IsOptional()
    visitId?: string;

}

export class HospitalVisitActivityEditDto implements HospitalVisitActivityEditInput {

    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({required: false})
    @IsUUID()
    @IsOptional()
    visitId?: string;

    @ApiProperty({type: [String]})
    @IsUUID('all', {each: true})
    children: Array<string>; // -> id of VisitedChild

    @ApiProperty({enum: VisitActivityType, isArray: true})
    @IsEnum(VisitActivityType, {each: true})
    activities: Array<VisitActivityType>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment: string;

}
