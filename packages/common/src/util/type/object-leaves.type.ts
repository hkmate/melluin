type Join<K, P> = K extends string
    ? P extends string
        ? `${K}${'' extends P ? '' : '.'}${P}`
        : never
    : never;

export type Leaves<T> = T extends object
    ? {
        [K in keyof T]-?: Join<K, Leaves<T[K]>>;
    }[keyof T]
    : '';
