import {UUID} from '../util/type/uuid.type';

export interface ChildAgesByDepartments {
    departmentId: UUID;
    departmentName: string;
    sum: number;
    zeroToHalf: number;
    halfToOne: number;
    oneToThree: number;
    threeToFive: number;
    fiveToSeven: number;
    sevenToNine: number;
    nineToEleven: number;
    elevenToThirteen: number;
    thirteenToFifteen: number;
    fifteenToSeventeen: number;
    seventeenToUp: number;
}
