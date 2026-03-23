import {Component, inject, input, linkedSignal, model, signal} from '@angular/core';
import {FilteringInfo, PersonIdentifier, RoleTypes, UUID} from '@melluin/common';
import {FormsModule} from '@angular/forms';
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
export class PersonSelectComponent implements FormValueControl<Array<UUID>> {

    private readonly personService = inject(CachedPeopleService);
    private readonly cacheName = 'peopleFilter';

    public readonly label = input.required<string>();

    public readonly value = model<Array<UUID>>([]);
    public readonly disabled = input<boolean>(false);
    public readonly required = input<boolean>(false);

    protected readonly filterText = signal<''>('');
    protected readonly filteredOptions = linkedSignal(() => this.filterOptions());
    protected readonly selectedPeople = linkedSignal(() => this.getSelectedPeople());

    private peopleOptions: Array<PersonIdentifier> = [];

    constructor() {
        this.initPersonOptions();
    }

    protected filterOptions(): Array<PersonIdentifier> {
        const regex = new RegExp(this.filterText(), 'i');
        return this.peopleOptions.filter(person => person.lastName.match(regex) || person.firstName.match(regex));
    }

    protected removePerson(removedPersonId: UUID): void {
        this.value.update(old => old.filter(personId => personId !== removedPersonId));
    }

    private getSelectedPeople(): Array<PersonIdentifier> {
        const selectedIds = this.value();
        return this.peopleOptions.filter(p => selectedIds.includes(p.id));
    }

    private async initPersonOptions(): Promise<void> {
        this.peopleOptions = await this.personService.loadAllPeople(this.getFilterOptions(), this.cacheName);
        this.filteredOptions.set([...this.peopleOptions]);
        this.selectedPeople.set(this.getSelectedPeople());
    }

    private getFilterOptions(): FilteringInfo {
        return {
            sort: {'lastName': 'ASC', 'firstName': 'ASC'},
            where: [{
                'user.isActive': {operator: 'eq', operand: true},
                'user.roleTypes': {
                    operator: 'in',
                    operand: [RoleTypes.INTERN, RoleTypes.VISITOR, RoleTypes.COORDINATOR]
                }
            }]
        };
    }

}
