import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ViewType, ViewTypeIconMapper} from '@fe/app/util/view-type-selector/view-type';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-view-type-selector',
    templateUrl: './view-type-selector.component.html',
    styleUrls: ['./view-type-selector.component.scss'],
    imports: [
        MatButtonToggleModule,
        FormsModule,
        NgForOf,
        MatIconModule
    ],
    standalone: true
})
export class ViewTypeSelectorComponent {

    ViewTypeIconMapper = ViewTypeIconMapper;

    @Input()
    public options: Array<ViewType> = [ViewType.TABLE, ViewType.LIST];

    @Input()
    public viewType: ViewType = this.options?.[0];

    @Output()
    public viewTypeChange = new EventEmitter<ViewType>();


}
