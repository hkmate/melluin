import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildCardComponent} from './child-card/child-card.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {ChildrenListComponent} from './children-list/children-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ParentInfoIconComponent} from './parent-info-icon/parent-info-icon.component';
import {ChildAgePipe} from './child-age/child-age.pipe';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        TranslateModule,
    ],
    declarations: [
        ChildCardComponent,
        ChildrenListComponent,
        ParentInfoIconComponent,
        ChildAgePipe
    ],
    exports: [
        ChildrenListComponent,
        ParentInfoIconComponent,
        ChildAgePipe
    ]
})
export class ChildModule {
}
