import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';

export class TableDataSource<T> extends DataSource<T> {

    private data = new BehaviorSubject<Array<T>>([]);

    public emit(dataToEmit: Array<T>): void {
        this.data.next(dataToEmit)
    }

    public override connect(): Observable<Array<T>> {
        return this.data;
    }

    public override disconnect(): void {
    }

}
