import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';
import {isNilOrEmpty} from '@shared/util/util';


// eslint-disable-next-line max-lines-per-function
export function IsYearAndMonth(minYear?: number, validationOptions?: ValidationOptions): PropertyDecorator {
    // eslint-disable-next-line max-lines-per-function
    return (object: object, propertyName: string | symbol): void => {
        registerDecorator({
            name: 'IsYearAndMonth',
            target: object.constructor,
            propertyName: propertyName as string,
            constraints: [minYear],
            options: validationOptions,
            validator: {
                validate: (value: string, args: ValidationArguments): boolean => {
                    const [minYear] = isNilOrEmpty(args.constraints) ? [0] : args.constraints;
                    const maxYear = new Date().getFullYear();
                    const yearPart = +value.split('.')[0];
                    const monthPart = +value.split('.')[1];
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    return yearPart >= minYear && yearPart <= maxYear && monthPart > 0 && monthPart <= 12;
                },
            },
        });
    };
}
