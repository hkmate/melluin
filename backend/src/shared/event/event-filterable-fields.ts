export const eventSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedMinutes'
];

export const eventFilterableFields = [
    ...eventSortableFields,
    'organizer.id',
    'organizer.name'
];
