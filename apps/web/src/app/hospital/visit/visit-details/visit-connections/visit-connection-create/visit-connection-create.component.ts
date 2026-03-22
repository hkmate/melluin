import {ChangeDetectionStrategy, Component, effect, inject, input, output, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {isNotNil, UUID, Visit} from '@melluin/common';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {MatButton} from '@angular/material/button';
import {LoaderService} from '@fe/app/loader/loader.service';
import {VisitConnectedVisitComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connected-visit/visit-connected-visit.component';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {form, FormField, pattern, required} from '@angular/forms/signals';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        TranslateModule,
        MatButton,
        VisitConnectedVisitComponent,
        FormField
    ],
    selector: 'app-visit-connection-create',
    templateUrl: './visit-connection-create.component.html',
    styleUrl: './visit-connection-create.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitConnectionCreateComponent {

    private readonly uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    private readonly visitService = inject(VisitService);
    private readonly loaderService = inject(LoaderService);

    public readonly visit = input.required<Visit>();
    public readonly submitted = output<Visit>()

    protected readonly connectionCandidate = signal<Visit | undefined>(undefined);

    protected readonly innerForm = form(signal({id: '' as UUID}), schema => {
        required(schema.id, {message: t('Form.Required')});
        pattern(schema.id, this.uuidPattern, {message: t('Form.UUID')});
    });

    constructor() {
        effect(() => {
            if (this.innerForm.id().invalid()) {
                return;
            }
            this.loadCandidate(this.innerForm.id().value());
        });
    }

    protected submitVisit(): void {
        const connectionCandidate = this.connectionCandidate();
        if (isNotNil(connectionCandidate)) {
            this.submitted.emit(connectionCandidate);
        }
    }

    private loadCandidate(candidateVisitId: UUID): void {
        this.loaderService.startLoader();
        this.visitService.getVisit(candidateVisitId).subscribe({
            next: visit => {
                this.connectionCandidate.set(visit);
                this.loaderService.stopLoader();
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === HttpStatusCode.NotFound) {
                    this.connectionCandidate.set(undefined);
                }
                this.loaderService.stopLoader();
            }
        });
    }

}
