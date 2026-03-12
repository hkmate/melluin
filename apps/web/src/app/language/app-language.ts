export const AppLanguages = {
    HU: 'hu'
} as const;

export type AppLanguage = typeof AppLanguages[keyof typeof AppLanguages];
