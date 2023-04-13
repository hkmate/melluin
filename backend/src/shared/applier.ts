export interface Applier<T> {

    applyOn(valueToChange: T): void;
}

export interface AsyncApplier<T> {

    applyOn(valueToChange: T): Promise<void>;

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

export class AsyncApplierChain<T> implements AsyncApplier<T> {

    private constructor(private readonly appliers: Array<AsyncApplier<T>> = []) {
    }

    public static of<T>(...appliers: Array<AsyncApplier<T>>): AsyncApplierChain<T> {
        return new AsyncApplierChain(appliers);
    }

    public async applyOn(value: T): Promise<void> {
        for await (const applier of this.appliers) {
            await applier.applyOn(value);
        }
    }

}
