import * as _ from 'lodash';
import {toDeepPlain} from '@be/util/to-deep-plain';

export function isDeepEqual<T extends object | undefined | null>(a: T, b: T): boolean {
    return _.isEqual(toDeepPlain(a), toDeepPlain(b));
}
