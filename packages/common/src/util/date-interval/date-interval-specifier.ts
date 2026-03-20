export const DateIntervalSpecifiers = {
    WEEK: 'WEEK',  // Actual week
    TWO_WEEK: 'TWO_WEEK', // Actual + next week
    THREE_WEEK: 'THREE_WEEK', // Previous + actual + next week
    MONTH: 'MONTH', // Actual month
    LAST_WEEK: 'LAST_WEEK', // Last week
    LAST_TWO_WEEK: 'LAST_TWO_WEEK', // Last two weeks
    LAST_MONTH: 'LAST_MONTH', // Last month
} as const;

export type DateIntervalSpecifier = typeof DateIntervalSpecifiers[keyof typeof DateIntervalSpecifiers];
