import {Component, forwardRef, inject, input, signal} from '@angular/core';
import {PersonIdentifier} from '@shared/person/person';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNil, NOOP, VoidFunc} from '@shared/util/util';
import {CachedPeopleService} from '@fe/app/people/cached-people.service';
import {FilteringInfo} from '@shared/api-util/pageable';
import {RoleType} from '@shared/user/role';

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

    private readonly personService = inject(CachedPeopleService);

    private readonly cacheName = 'peopleFilter';

    public readonly label = input.required<string>();

    protected filteredOptions: Array<PersonIdentifier>;
    protected people: Array<PersonIdentifier>
    protected disabled = signal(false);

    private onChange: (x: Array<string>) => void = NOOP;
    private onTouch: VoidFunc = NOOP;
    private peopleOptions: Array<PersonIdentifier>;

    private personIds: Array<string>;

    constructor() {
        this.initPersonOptions();
    }

    public writeValue(personIds: Array<string>): void {
        this.personIds = personIds;
        this.setupPeople();
    }

    public registerOnChange(fn: (x: Array<string>) => void): void {
        this.onChange = fn
    }

    public registerOnTouched(fn: VoidFunc): void {
        this.onTouch = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    protected selectChanged(people: Array<PersonIdentifier>): void {
        this.people = people;
        this.personIds = people.map(p => p.id);
        this.onChange(this.personIds);
    }

    protected filterChanged(filter: string): void {
        const regex = new RegExp(filter, 'i');
        this.filteredOptions = this.peopleOptions.filter(
            person => person.lastName.match(regex) || person.firstName.match(regex));
    }

    protected removePerson(removedPerson: PersonIdentifier): void {
        this.people = this.people.filter(person => person.id !== removedPerson.id);
        this.personIds = this.people.map(p => p.id);
        this.onChange(this.personIds);
    }

    private setupPeople(): void {
        if (isNil(this.personIds) || isNil(this.peopleOptions)) {
            return;
        }
        this.people = this.peopleOptions.filter(p => this.personIds.includes(p.id));
    }

    private initPersonOptions(): void {
        this.personService.loadAllPeople(this.getFilterOptions(), this.cacheName).subscribe(
            (peopleOptions: Array<PersonIdentifier>) => {
                this.peopleOptions = peopleOptions;
                this.filteredOptions = [...this.peopleOptions];
                this.setupPeople();
            }
        );
    }

    private getFilterOptions(): FilteringInfo {
        return {
            sort: {'lastName': 'ASC', 'firstName': 'ASC'},
            where: [{
                'user.isActive': {operator: 'eq', operand: true},
                'user.roleTypes': {
                    operator: 'in',
                    operand: [RoleType.INTERN, RoleType.VISITOR, RoleType.COORDINATOR]
                }
            }]
        };
    }

}
