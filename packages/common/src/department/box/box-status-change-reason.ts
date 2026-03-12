import {EnumTypeOf} from '../../util/type/enum.type';

export const BoxStatusChangeReasons = {
    MISSING: 'MISSING',
    BROKEN: 'BROKEN',
    NEED_REFILL: 'NEED_REFILL',
    NEED_CLEANING: 'NEED_CLEANING',
    CEASED: 'CEASED',
    CORRECTED: 'CORRECTED',
    COMMENT: 'COMMENT'
} as const;

export type BoxStatusChangeReason = EnumTypeOf<typeof BoxStatusChangeReasons>;
