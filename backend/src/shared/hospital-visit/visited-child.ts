import {IsBoolean, IsString, IsUUID, ValidateIf, ValidateNested} from 'class-validator';
import {Child} from '@shared/child/child';
import {Type} from 'class-transformer';
import {ChildInput} from '@shared/child/child-input';
import {isNil} from '@shared/util/util';


// Note: If both 'child' and 'childId' presented the property 'child' will be processed.
export class VisitedChildInput {

    @IsUUID()
    @IsString()
    @ValidateIf(o => isNil(o.child))
    childId?: string;

    @ValidateNested()
    @Type(type => ChildInput)
    @ValidateIf(o => isNil(o.childId))
    child?: ChildInput;

    @IsBoolean()
    isParentThere: boolean;

}

export class VisitedChildWithChildInput {

    @ValidateNested()
    @Type(type => ChildInput)
    child: ChildInput;

    @IsBoolean()
    isParentThere: boolean;

}

export class VisitedChildWithChildIdInput {

    @IsUUID()
    @IsString()
    childId: string;

    @IsBoolean()
    isParentThere: boolean;

}

export class VisitedChildEditInput {

    @IsUUID()
    id: string;

    @ValidateNested()
    @Type(type => ChildInput)
    child: ChildInput;

    @IsBoolean()
    isParentThere: boolean;

}

export class VisitedChild {

    id: string;

    visitId: string;

    child: Child;

    isParentThere: boolean;

}
