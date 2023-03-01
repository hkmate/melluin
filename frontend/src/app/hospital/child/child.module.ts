import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildCardComponent} from './child-card/child-card.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {ChildrenListComponent} from './children-list/children-list.component';
import {ChildrenListManagerComponent} from './children-list-manager/children-list-manager.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ChildCreateComponent} from './child-create/child-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';


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
        ChildrenListManagerComponent,
        ChildCreateComponent
    ],
    exports: [
        ChildrenListComponent,
        ChildrenListManagerComponent,
        ChildCreateComponent
    ]
})
export class ChildModule {
}
