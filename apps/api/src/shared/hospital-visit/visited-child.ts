import {Child} from '@shared/child/child';
import {ChildInput} from '@shared/child/child-input';


// Note: If both 'child' and 'childId' presented the property 'child' will be processed.
export interface VisitedChildInput {

    childId?: string;
    child?: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChildWithChildInput {

    child: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChildWithChildIdInput {

    childId: string;
    isParentThere: boolean;

}

export interface VisitedChildEditInput {

    id: string;
    child: ChildInput;
    isParentThere: boolean;

}

export interface VisitedChild {

    id: string;
    visitId: string;
    child: Child;
    isParentThere: boolean;

}
