import {VisitedChild} from '@melluin/common';

export type VisitedChildById = Record<string, VisitedChild>;

export function convertToChildrenById(children: Array<VisitedChild>): VisitedChildById {
    return children.reduce<VisitedChildById>(
        (result, visitedChild) => {
            result[visitedChild.id] = visitedChild;
            return result;
        }, {});
}
