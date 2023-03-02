import {DateUtil} from '@shared/util/date-util';


/**
 * Calculation logic:
 *   (2023.01   2022.10)  => 3 months
 *   2023-2022 = 1 year => 12 months
 *   01-10 = -9 months
 *   => 12 + (-9) = 3 months
 *
 *
 *   (2023.03   2020.01)  => 38 months
 *   2023-2020 = 3 year => 36 months
 *   03-01 = 2 months
 *   => 36 + 2 = 38 months
 *
 */
export function getMonthsSince(guessedBirth: string, nowDate = DateUtil.now()): number {
    const [year, month] = guessedBirth.split('.').map(x => +x);
    const actualYear = nowDate.getFullYear();
    const actualMonth = nowDate.getMonth() + 1; // getMonth() returns 0-11
    return (12 * (actualYear - year)) + (actualMonth - month);
}


/**
 * (1.5, 2023.10)  => '2022.04'
 *
 *
 */
export function getGuessedBirthFromYears(years: number, nowDate = DateUtil.now()): string {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const months = years * 12;
    const dateForCalculation = new Date(nowDate);
    dateForCalculation.setMonth(nowDate.getMonth() - months);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const paddedMonths = `${dateForCalculation.getMonth() + 1}`.padStart(2, '0');
    return `${dateForCalculation.getFullYear()}.${paddedMonths}`
}
