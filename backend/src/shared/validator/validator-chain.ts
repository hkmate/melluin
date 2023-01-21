import {Validator} from '@shared/validator/validator';

export class ValidatorChain<T> implements Validator<T> {

    private constructor(private validators: Array<Validator<T>> = []) {
    }

    public static of<T>(...validators: Array<Validator<T>>): ValidatorChain<T> {
        return new ValidatorChain(validators);
    }

    public validate(value: T): void | never {
        this.validators.forEach(validator => validator.validate(value));
    }

}
