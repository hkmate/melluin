import {EnumTypeOf} from '../util/type/enum.type';

export const VisitActivityTypes = {
    UNO: 'UNO',
    BUG_POKER: 'BUG_POKER',
    OTHER_CARD_GAME: 'OTHER_CARD_GAME',
    MUSIC: 'MUSIC',
    PAPER_SNAKE_MAKING: 'PAPER_SNAKE_MAKING',
    OTHER_HANDCRAFT: 'OTHER_HANDCRAFT',
    SMALLTALK: 'SMALLTALK',
    CHERISH: 'CHERISH',
    BABY_MASSAGE: 'BABY_MASSAGE',
    PUPPETRY: 'PUPPETRY',
    TALE_TELLING: 'TALE_TELLING',
    DRAWING: 'DRAWING',
    BOARD_GAME: 'BOARD_GAME',
    WALKING: 'WALKING',
    OTHER: 'OTHER',
} as const;

export type VisitActivityType = EnumTypeOf<typeof VisitActivityTypes>;
