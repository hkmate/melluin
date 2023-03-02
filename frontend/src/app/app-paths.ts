import {PathProvider} from './path-resolve/path-resolve.service';
import {Injectable} from '@angular/core';

export type CreateMarkerType = 'new';
export const CREATE_MARKER: CreateMarkerType = 'new';

export const PATHS: PathContainer = {

    dashboard: {
        main: 'dashboard',
    },

    login: {
        main: 'login',
    },

    people: {
        main: 'people',
        detail: ':id',
        new: CREATE_MARKER
    },

    hospitalDepartments: {
        main: 'hospital-departments',
        detail: ':id',
        new: CREATE_MARKER
    },

    events: {
        main: 'events'
    },

    hospitalVisit: {
        main: 'hospital-visits',
        detail: ':id',
        fillActivities: ':id/fill-activities'
    }

};

export interface PathDescriptor {
    main: string;

    [subKeys: string]: string;
}

export class PathContainer {

    [moduleName: string]: PathDescriptor;

}

@Injectable()
export class MelluinPathProvider extends PathProvider {

    constructor(private pathContainer: PathContainer) {
        super();
    }

    public override isId(str: string): boolean {
        return str === ':id';
    }

    public override allPaths(): Array<Array<string>> {
        const result: Array<Array<string>> = [];
        for (const key of Object.keys(this.pathContainer)) {
            result.push(...this.convertPathDescriptorToArray(this.pathContainer[key]));
        }
        return result;
    }

    private convertPathDescriptorToArray(descriptor: PathDescriptor): Array<Array<string>> {
        return [[descriptor.main]].concat(
            Object.keys(descriptor)
                .filter(key => key !== 'main')
                .map(key => descriptor[key])
                .map(path => path.split('/'))
                .map(pathParts => [descriptor.main].concat(pathParts))
        );
    }

}
