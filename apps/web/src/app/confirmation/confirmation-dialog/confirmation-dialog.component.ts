import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {Platform} from '@angular/cdk/platform';
import {MatButton} from '@angular/material/button';
import {ConfirmationAnswer, ConfirmationAnswers, ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';

@Component({
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton
    ],
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {

    ConfirmationAnswers = ConfirmationAnswers;

    private readonly platform = inject(Platform);
    private readonly dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
    protected readonly config = inject<ConfirmationDialogConfig>(MAT_DIALOG_DATA);

    protected readonly mobilScreen = this.platform.IOS || this.platform.ANDROID;

    protected close(answer: ConfirmationAnswer): void {
        this.dialogRef.close(answer);
    }

}
