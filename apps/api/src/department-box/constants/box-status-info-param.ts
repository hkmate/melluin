export const BoxStatusInfoParams = {
    WITH_DEPARTMENT_BRIEF: 'WITH_DEPARTMENT_BRIEF',
    PURE_BOX_STATUS: 'PURE_BOX_STATUS'
} as const;

export type BoxStatusInfoParam = typeof BoxStatusInfoParams[keyof typeof BoxStatusInfoParams];
