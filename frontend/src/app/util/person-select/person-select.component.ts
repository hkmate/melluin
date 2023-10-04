import {Component, forwardRef, Input} from '@angular/core';
import {PersonIdentifier} from '@shared/person/person';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VoidFunc} from '@shared/util/util';

@Component({
    selector: 'app-person-select',
    templateUrl: './person-select.component.html',
    styleUrls: ['./person-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PersonSelectComponent),
        multi: true
    }]
})
export class PersonSelectComponent implements ControlValueAccessor {

    @Input()
    public label: string;

    protected filteredOptions: Array<PersonIdentifier>;
    protected people: Array<PersonIdentifier>

    private onChange: (x: Array<PersonIdentifier>) => void = NOOP;
    private onTouch: VoidFunc = NOOP;
    private peopleOptions: Array<PersonIdentifier>

    @Input()
    public set options(value: Array<PersonIdentifier>) {
        this.peopleOptions = value;
        this.filteredOptions = value;
    }

    public writeValue(value: Array<PersonIdentifier>): void {
        this.people = value;
    }

    public registerOnChange(fn: (x: Array<PersonIdentifier>) => void): void {
        this.onChange = fn
    }

    public registerOnTouched(fn: VoidFunc): void {
        this.onTouch = fn;
    }

    protected selectChanged(people: Array<PersonIdentifier>): void {
        this.people = people;
        this.onChange(this.people);
    }

    protected filterChanged(filter: string): void {
        const regex = new RegExp(filter, 'i');
        this.filteredOptions = this.peopleOptions.filter(
            person => person.lastName.match(regex) || person.firstName.match(regex));
    }

    protected removePerson(removedPerson: PersonIdentifier): void {
        this.people = this.people.filter(person => person.id !== removedPerson.id);
    }

}
