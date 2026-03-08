import {Component, effect, forwardRef, inject, input, model, signal} from '@angular/core';
import {FilteringInfo, isNil, NOOP, PersonIdentifier, RoleType, VoidFunc} from '@melluin/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CachedPeopleService} from '@fe/app/people/cached-people.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatChipListbox, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatSelectSearchComponent} from 'ngx-mat-select-search';
import {TranslatePipe} from '@ngx-translate/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        MatChipRemove,
        PersonNamePipe,
        MatIcon,
        MatSelect,
        MatOption,
        MatSelectSearchComponent,
        TranslatePipe,
        FormsModule
    ],
    selector: 'app-person-select',
    templateUrl: './person-select.component.html',
    styleUrls: ['./person-select.component.scss'],
})
export class PersonSelectComponent2 implements FormValueControl<Array<string>> {

    private readonly personService = inject(CachedPeopleService);
    private readonly cacheName = 'peopleFilter';

    public readonly label = input.required<string>();

    public readonly value = model<Array<string>>([]);
    public readonly disabled = input<boolean>(false);

    protected readonly filteredOptions = signal<Array<PersonIdentifier>>([]);
    protected readonly selectedPeople = signal<Array<PersonIdentifier>>([]);
    protected readonly filterText = signal<''>('');

    private peopleOptions: Array<PersonIdentifier> = [];

    constructor() {
        this.initPersonOptions();
        effect(() => this.setupPeople());
        effect(() => this.writeNewSelected());
        effect(() => this.filterOptions());
    }

    protected writeNewSelected(): void {
        this.value.set(this.selectedPeople().map(p => p.id));
    }

    protected filterOptions(): void {
        const regex = new RegExp(this.filterText(), 'i');
        this.filteredOptions.set(this.peopleOptions.filter(
            person => person.lastName.match(regex) || person.firstName.match(regex))
        );
    }

    protected removePerson(removedPerson: PersonIdentifier): void {
        const newSelectedPeople = this.selectedPeople().filter(person => person.id !== removedPerson.id);
        this.selectedPeople.set(newSelectedPeople);
        this.value.set(newSelectedPeople.map(p => p.id));
    }

    private setupPeople(): void {
        this.selectedPeople.set(this.peopleOptions.filter(p => this.value().includes(p.id)));
    }

    private initPersonOptions(): void {
        this.personService.loadAllPeople(this.getFilterOptions(), this.cacheName).subscribe(
            (peopleOptions: Array<PersonIdentifier>) => {
                this.peopleOptions = peopleOptions;
                this.filteredOptions.set([...this.peopleOptions]);
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


/**
 * @deprecated Will be removed when every component got refactored to signal based forms
 */
@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        PersonNamePipe,
        MatIcon,
        MatSelect,
        FormsModule,
        MatOption,
        MatSelectSearchComponent,
        TranslatePipe
    ],
    selector: 'app-person-select',
    template: `
        <mat-form-field>
            <mat-label>{{ label() }}</mat-label>
            <mat-chip-listbox>
                @for (person of people; track person.id) {
                    <mat-chip-row (removed)="removePerson(person)">
                        {{ person | personName }}
                        @if (!disabled()) {
                            <button matChipRemove>
                                <mat-icon>cancel</mat-icon>
                            </button>
                        }
                    </mat-chip-row>
                }
            </mat-chip-listbox>
            <mat-select [ngModel]="people"
                        (ngModelChange)="selectChanged($event)"
                        [disabled]="disabled()"
                        multiple>
                <mat-option>
                    <ngx-mat-select-search ngModel (ngModelChange)="filterChanged($event)"
                                           [placeholderLabel]="'Search' | translate"
                                           [noEntriesFoundLabel]="'NoItemFound' | translate">
                    </ngx-mat-select-search>
                </mat-option>
                @for (option of filteredOptions; track option.id) {
                    <mat-option [value]="option">{{ option | personName }}</mat-option>
                }
            </mat-select>
        </mat-form-field>
    `,
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
