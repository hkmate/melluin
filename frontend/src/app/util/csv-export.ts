import {stringify} from 'csv-stringify/browser/esm/sync'

export function exportCSV(name: string, header: Record<string, string>, data: Array<Record<string, string>>): void {
    const csvString = stringify(data, {
        header: true,
        columns: Object.entries(header).map(([key, header]) => ({key, header}))
    });

    downloadStringFile(name, csvString);
}


function downloadStringFile(fileName: string, data: string): void {
    const blob = new Blob([data], {type: 'text/csv'});
    const fileURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileURL);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    }, 1000);
}
