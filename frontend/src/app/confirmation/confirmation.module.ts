import {ModuleWithProviders, NgModule} from '@angular/core';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgClass} from '@angular/common';


@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        NgClass
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
