export type EnumTypeOf<T extends Record<string, string>> = T[keyof T];
