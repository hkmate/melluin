import {Component, inject, input, output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {Visit, isNotNil} from '@melluin/common';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {MatButton} from '@angular/material/button';
import {LoaderService} from '@fe/app/loader/loader.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {getErrorHandler} from '@fe/app/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {VisitConnectedVisitComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connected-visit/visit-connected-visit.component';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';

@Component({
    selector: 'app-visit-connection-create',
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        TranslateModule,
        MatButton,
        VisitConnectedVisitComponent
    ],
    templateUrl: './visit-connection-create.component.html',
    styleUrl: './visit-connection-create.component.scss'
})
export class VisitConnectionCreateComponent {

    private readonly uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    private readonly visitService = inject(VisitService);
    private readonly loaderService = inject(LoaderService);
    private readonly msgService = inject(MessageService);

    public readonly visit = input.required<Visit>();
    public readonly submitted = output<Visit>()

    protected idControl = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(this.uuidPattern)]
    });

    protected connectionCandidate?: Visit;

    constructor() {
        this.idControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
            if (this.idControl.invalid) {
                return;
            }
            this.loadCandidate(value);
        });
    }

    protected submitVisit(): void {
        if (isNotNil(this.connectionCandidate)) {
            this.submitted.emit(this.connectionCandidate);
        }
    }

    private loadCandidate(candidateVisitId: string): void {
        this.loaderService.startLoader();
        this.visitService.getVisit(candidateVisitId).pipe(getErrorHandler(this.msgService)).subscribe({
            next: visit => {
                this.connectionCandidate = visit;
                this.loaderService.stopLoader();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === HttpStatusCode.NotFound) {
                    this.connectionCandidate = undefined;
                }
                this.loaderService.stopLoader();
            }
        });
    }

}
