import {PathProvider} from './path-resolve/path-resolve.service';
import {Injectable} from '@angular/core';

export const PATHS: PathContainer = {

    dashboard: {
        main: 'dashboard',
    },

    login: {
        main: 'login',
    },
};

export type PathDescriptor = {
    main: string;
    [subKeys: string]: string;
};

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
        const result = [];
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
