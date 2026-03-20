// Note: if a function returns with nullable this could convert it to optional value. (Normally we do not use null in the system)
export function toOptional<T>(value: T | null | undefined): T | undefined {
    return value ?? undefined;
}
