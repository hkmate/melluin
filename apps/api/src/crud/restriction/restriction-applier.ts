export interface RestrictionApplier<T> {

    apply(value: T): T;

}
