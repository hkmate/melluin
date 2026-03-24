import {inject, Injector, runInInjectionContext} from '@angular/core';
import {Visit} from '@melluin/common';
import {VisitActivityFiller} from '@fe/app/hospital/visit-activity-filler/visit-activity.filler';
import {isNil} from 'lodash-es';

export class VisitActivityFillerFactory {

    private readonly injector = inject(Injector);

    private singletonService: VisitActivityFiller | undefined = undefined;

    public createService(visit: Visit): VisitActivityFiller {
        return runInInjectionContext(this.injector, () => {
            this.singletonService = new VisitActivityFiller(visit);
            return this.singletonService;
        });
    }

    public getService(): VisitActivityFiller {
        if (isNil(this.singletonService)) {
            throw new Error('VisitActivityFillerService requested before initializing');
        }
        return this.singletonService;
    }


}
