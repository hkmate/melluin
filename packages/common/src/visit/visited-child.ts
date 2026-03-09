import {Child} from '../child/child';
import {ChildInput} from '../child/child-input';
import {UUID} from '../util/type/uuid.type';


// Note: If both 'child' and 'childId' presented the property 'child' will be processed.
export interface VisitedChildInput {

    childId?: UUID;
    child?: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChildWithChildInput {

    child: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChildWithChildIdInput {

    childId: UUID;
    isParentThere: boolean;

}

export interface VisitedChildEditInput {

    id: UUID;
    child: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChild {

    id: UUID;
    visitId: UUID;
    child: Child;
    isParentThere: boolean;

}
