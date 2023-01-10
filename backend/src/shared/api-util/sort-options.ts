export type OrderWay = 'ASC' | 'DESC';

export type SortOptions<T> = Partial<Record<keyof T, OrderWay>>;

