import {IsBoolean, IsString, IsUUID, ValidateIf, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ChildInput, isNil, VisitedChildEditInput, VisitedChildInput} from '@melluin/common';
import {ChildValidatedInput} from '@be/hospital-visit-children/api/dto/child-input';


// Note: If both 'child' and 'childId' presented the property 'child' will be processed.
export class VisitedChildValidatedInput implements VisitedChildInput {

    @IsUUID()
    @IsString()
    @ValidateIf(o => isNil(o.child))
    childId?: string;

    @ValidateNested()
    @Type(type => ChildValidatedInput)
    @ValidateIf(o => isNil(o.childId))
    child?: ChildInput;

    @IsBoolean()
    isParentThere: boolean;

}


export class VisitedChildEditValidatedInput implements VisitedChildEditInput {

    @IsUUID()
    id: string;

    @ValidateNested()
    @Type(type => ChildValidatedInput)
    child: ChildInput;

    @IsBoolean()
    isParentThere: boolean;

}
