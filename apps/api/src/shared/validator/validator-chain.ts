import {AsyncValidator, Validator} from '@shared/validator/validator';

export class ValidatorChain<T> implements Validator<T> {

    private constructor(private readonly validators: Array<Validator<T>> = []) {
    }

    public static of<T>(...validators: Array<Validator<T>>): ValidatorChain<T> {
        return new ValidatorChain(validators);
    }

    public validate(value: T): void | never {
        this.validators.forEach(validator => validator.validate(value));
    }

}

export class AsyncValidatorChain<T> implements AsyncValidator<T> {

    private constructor(private readonly validators: Array<AsyncValidator<T>> = []) {
    }

    public static of<T>(...validators: Array<AsyncValidator<T>>): AsyncValidatorChain<T> {
        return new AsyncValidatorChain(validators);
    }

    public validate(value: T): Promise<void> {
        return Promise.all(this.validators.map(validator => validator.validate(value))).then()
    }

}


