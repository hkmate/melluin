import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import {UUID, VisitActivityEditInput, VisitActivityInput, VisitActivityType, VisitActivityTypes} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';


export class VisitActivityDto implements VisitActivityInput {

    @ApiProperty({type: [String]})
    @IsUUID('all', {each: true})
    children: Array<UUID>; // -> id of VisitedChild

    @ApiProperty({enum: VisitActivityTypes, isArray: true})
    @IsEnum(VisitActivityTypes, {each: true})
    activities: Array<VisitActivityType>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment: string;

    @ApiProperty({required: false})
    @IsUUID()
    @IsOptional()
    visitId?: UUID;

}

export class VisitActivityEditDto implements VisitActivityEditInput {

    @ApiProperty()
    @IsUUID()
    id: UUID;

    @ApiProperty({required: false})
    @IsUUID()
    @IsOptional()
    visitId?: UUID;

    @ApiProperty({type: [String]})
    @IsUUID('all', {each: true})
    children: Array<UUID>; // -> id of VisitedChild

    @ApiProperty({enum: VisitActivityTypes, isArray: true})
    @IsEnum(VisitActivityTypes, {each: true})
    activities: Array<VisitActivityType>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment: string;

}
