import {SchemaPath, validate} from '@angular/forms/signals';
import {isEmpty} from '@melluin/common';
import {t} from '@fe/app/util/translate/translate';

export function noWhitespaceHeadOrTail(path: SchemaPath<string>): void {
    validate(path, ({value}) => {
        const text = value();
        if (isEmpty(text)) {
            return null;
        }
        if (text.match(/^(\s+.*\s*)|(\s*.*\s+)$/g)) {
            return {
                kind: 'noWhitespaceHeadOrTail',
                message: t('Form.NoWhitespaceHeadOrTail')
            };
        }
        return null;
    });
}
