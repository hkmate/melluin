import {UUID, VisitedChild} from '@melluin/common';

export type VisitedChildById = Record<UUID, VisitedChild>;

export function convertToChildrenById(children: Array<VisitedChild>): VisitedChildById {
    return children.reduce<VisitedChildById>(
        (result, visitedChild) => {
            result[visitedChild.id] = visitedChild;
            return result;
        }, {});
}
