export const UserActivations = {
    ACTIVATE: 'ACTIVATE',
    INACTIVATE: 'INACTIVATE',
} as const;

export type UserActivation = typeof UserActivations[keyof typeof UserActivations];
