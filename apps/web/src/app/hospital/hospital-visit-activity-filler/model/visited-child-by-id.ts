import {VisitedChild} from '@shared/hospital-visit/visited-child';

export type VisitedChildById = Record<string, VisitedChild>;

export function convertToChildrenById(children: Array<VisitedChild>): VisitedChildById {
    return children.reduce<VisitedChildById>(
        (result, visitedChild) => {
            result[visitedChild.id] = visitedChild;
            return result;
        }, {});
}
