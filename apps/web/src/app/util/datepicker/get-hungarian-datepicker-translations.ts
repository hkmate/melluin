import {DatepickerTranslations} from 'ngxsmk-datepicker';

// eslint-diable-next-line max-lines-per-function
export function getHungarianTranslations(): DatepickerTranslations {
    return {
        // Main actions
        selectDate: 'Válassz dátumot',
        selectTime: 'Válassz időpontot',
        clear: 'Töröl',
        close: 'Bezár',
        today: 'Ma',
        selectEndDate: 'Válassz vége dátumot',
        day: 'Nap',
        days: 'Napok',

        // Navigation
        previousMonth: 'Előző hónap',
        nextMonth: 'Következő',
        previousYear: 'Előző év',
        nextYear: 'Következő év',
        previousYears: 'Korábbi évek ',
        nextYears: 'Későbbi évek',
        previousDecade: 'Előző évtized',
        nextDecade: 'Következő évtized',

        // ARIA labels
        clearSelection: 'Kijelölés törlése',
        closeCalendar: 'Naptár bezárása',
        closeCalendarOverlay: 'Naptár panel bezárása',
        calendarFor: 'Naptár {{year}} {{month}}-hoz',
        selectYear: 'Év választása {{year}}',
        selectDecade: 'Évtized választása {{start}} - {{end}}',

        // Multiple selection
        datesSelected: '{{count}} dátumok kiválasztva',
        timesSelected: '{{count}} időpontok kiválasztva',

        // Time selection
        time: 'Idő:',
        startTime: 'Kezdési idő',
        endTime: 'Véde idő',
        from: 'Eleje',
        to: 'Vége',

        // Holiday
        holiday: 'Szünet',

        // View modes
        month: 'Hónap',
        year: 'Év',
        decade: 'Évtized',
        timeline: 'Idővonal',
        timeSlider: 'Idő csúszka',

        // ARIA live announcements
        calendarOpened: 'Naptár nyitva {{year}} {{month}}',
        calendarClosed: 'Naptár bezárva',
        dateSelected: 'Dátum választva: {{date}}',
        rangeSelected: 'Időintervallum választva: {{start}} to {{end}}',
        monthChanged: 'Módosítva: {{year}} {{month}}',
        yearChanged: 'Módosítva: {{year}}',
        calendarLoading: 'Naptár betöltése...',
        calendarReady: 'Naptár készen áll',
        keyboardShortcuts: 'Gyorsbillentyűk',

        // Validation / error messages (user-facing)
        invalidDateFormat: 'Érvényes dátumot adjon meg',
        dateBeforeMin: 'Dátum későbbi vagy akkor kell legyen mint {{minDate}}.',
        dateAfterMax: 'Dátum korábbi vagy akkor kell legyen mint {{maxDate}}.',
        invalidDate: 'Érvénytelen.',
    };
}
