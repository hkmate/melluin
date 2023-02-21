import * as _ from 'lodash';

export function areArrayHasSameItems<T>(arr1: Array<T>, arr2: Array<T>): boolean {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return _.isEqual(set1, set2);
}
