import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {LevenshteinCalculator} from './levenshtein-calculator';

@Injectable()
export abstract class PathProvider {
    public abstract isId(str: string): boolean;

    public abstract allPaths(): Array<Array<string>>;
}

@Injectable({
    providedIn: 'root'
})
export class PathResolveService implements Resolve<string | null> {

    private static readonly UUID_CHARSET_REGEX = /[0-9\-a-fA-F]{33,39}/; // The normal UUID's size is 36 char, I add +-3 difference.

    public constructor(private readonly pathProvider: PathProvider) {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | null {
        const typoUrlSegments = route.url.map((urlSegment: UrlSegment) => urlSegment.path);

        return `/${this.getSimilarPath(typoUrlSegments).join('/')}`;
    }

    private getSimilarPath(typoPath: Array<string>): Array<string> {
        let relevantPaths: Array<Array<string>> = [...this.pathProvider.allPaths()]
            .filter((path: Array<string>) => typoPath.length === path.length);

        for (let i = 0; i < typoPath.length; ++i) {
            relevantPaths.sort((a: Array<string>, b: Array<string>) => {
                return this.getDistance(a[i], typoPath[i]) - this.getDistance(b[i], typoPath[i]);
            });
            relevantPaths = relevantPaths.filter((path: Array<string>) => path[i] === relevantPaths[0][i]);
        }
        return this.getActualizedPath(relevantPaths[0], typoPath);
    }

    private getActualizedPath(foundPath: Array<string>, typoPath: Array<string>): Array<string> {
        return foundPath.map((value: string, index: number) => this.pathProvider.isId(value) ? typoPath[index] : value);
    }

    private getDistance(definedPathElement: string, typoPathElement: string): number {
        if (this.pathProvider.isId(definedPathElement) && this.isUuidLike(typoPathElement)) {
            return 0;
        }
        return LevenshteinCalculator.getLevenshteinDistance(definedPathElement, typoPathElement);
    }

    private isUuidLike(text: string): boolean {
        return !!text.match(PathResolveService.UUID_CHARSET_REGEX);
    }
}
