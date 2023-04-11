import {Child} from '@shared/child/child';
import {ChildInput} from '@shared/child/child-input';

export interface PatientChild {

    child: Child;
    isParentThere?: boolean;

}

export interface PatientChildId {

    childId: string;
    isParentThere?: boolean;

}

export interface PatientChildInput {

    child: ChildInput;
    isParentThere?: boolean;

}
