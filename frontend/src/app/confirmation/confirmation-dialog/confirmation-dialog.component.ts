import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmationAnswer, ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {Platform} from '@angular/cdk/platform';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    ConfirmationAnswer = ConfirmationAnswer;

    protected mobilScreen: boolean;

    constructor(private readonly platform: Platform,
                private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) protected readonly config: ConfirmationDialogConfig) {
    }

    public ngOnInit(): void {
        this.mobilScreen = this.platform.IOS || this.platform.ANDROID;
    }

    protected close(answer: ConfirmationAnswer): void {
        this.dialogRef.close(answer);
    }

}
