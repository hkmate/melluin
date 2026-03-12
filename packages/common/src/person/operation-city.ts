export const OperationCities = {
    PECS: 'PECS',
    KAPOSVAR: 'KAPOSVAR',
    SZIGETVAR: 'SZIGETVAR',
} as const;

export type OperationCity = typeof OperationCities[keyof typeof OperationCities];

