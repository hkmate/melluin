export const eventSortableFields = [
    'dateTimeFrom', 'dateTimeTo', 'countedHours'
];

export const eventFilterableFields = [
    ...eventSortableFields, 'organizer.id', 'organizer.name', 'participant.id', 'participant.name'
];
