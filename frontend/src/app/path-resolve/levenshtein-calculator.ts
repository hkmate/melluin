import {isEmpty} from '@shared/util/util';

export class LevenshteinCalculator {

    public static getLevenshteinDistance(a: string, b: string): number {
        if (isEmpty(a)) {
            return b.length;
        }
        if (isEmpty(b)) {
            return a.length;
        }

        return this.createLevenshteinMatrix(a, b)[b.length][a.length];
    }

    /* eslint-disable max-lines-per-function, @typescript-eslint/array-type, @typescript-eslint/no-magic-numbers */
    private static createLevenshteinMatrix(a: string, b: string): number[][] {
        const matrix: number[][] = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1,
                    );
                }
            }
        }
        return matrix;
    }
    /* eslint-enable */

}
