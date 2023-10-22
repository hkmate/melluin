import {ModuleWithProviders, NgModule} from '@angular/core';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';


@NgModule({
    imports: [
        CommonModule,

        MatDialogModule,
        MatButtonModule,
    ],
    declarations: [
        ConfirmationDialogComponent
    ]
})
export class ConfirmationModule {

    public static forRoot(): ModuleWithProviders<ConfirmationModule> {
        return {
            ngModule: ConfirmationModule,
            providers: [
                ConfirmationService,
            ]
        };
    }

}
