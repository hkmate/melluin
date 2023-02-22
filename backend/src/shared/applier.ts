export interface Applier<T> {

    applyOn(valueToChange: T): void;
}


export class ApplierChain<T> implements Applier<T> {

    private constructor(private readonly appliers: Array<Applier<T>> = []) {
    }

    public static of<T>(...appliers: Array<Applier<T>>): ApplierChain<T> {
        return new ApplierChain(appliers);
    }

    public applyOn(value: T): void {
        this.appliers.forEach(applier => applier.applyOn(value));
    }

}
