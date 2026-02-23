import {Component, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {Platform} from '@angular/cdk/platform';
import {MatButton} from '@angular/material/button';
import {ConfirmationAnswer, ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';

@Component({
    selector: 'app-confirmation-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton
    ],
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    ConfirmationAnswer = ConfirmationAnswer;

    private readonly platform = inject(Platform);
    private readonly dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
    protected readonly config = inject<ConfirmationDialogConfig>(MAT_DIALOG_DATA);

    protected readonly mobilScreen = this.platform.IOS || this.platform.ANDROID;

    protected close(answer: ConfirmationAnswer): void {
        this.dialogRef.close(answer);
    }

}
