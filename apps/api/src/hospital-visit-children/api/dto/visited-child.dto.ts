import {IsBoolean, IsString, IsUUID, ValidateIf, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ChildInput, isNil, VisitedChildEditInput, VisitedChildInput} from '@melluin/common';
import {ChildInputDto} from '@be/hospital-visit-children/api/dto/child-input.dto';
import {ApiProperty} from '@nestjs/swagger';


// Note: If both 'child' and 'childId' presented the property 'child' will be processed.
export class VisitedChildInputDto implements VisitedChildInput {

    @ApiProperty({required: false})
    @IsUUID()
    @IsString()
    @ValidateIf(o => isNil(o.child))
    childId?: string;

    @ApiProperty({type: () => ChildInputDto, required: false})
    @ValidateNested()
    @Type(type => ChildInputDto)
    @ValidateIf(o => isNil(o.childId))
    child?: ChildInput;

    @ApiProperty()
    @IsBoolean()
    isParentThere: boolean;

}


export class VisitedChildEditInputDto implements VisitedChildEditInput {

    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({type: () => ChildInputDto})
    @ValidateNested()
    @Type(type => ChildInputDto)
    child: ChildInput;

    @ApiProperty()
    @IsBoolean()
    isParentThere: boolean;

}
