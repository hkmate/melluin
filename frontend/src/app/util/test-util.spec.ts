
function pickRandom(): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible[Math.floor(Math.random() * possible.length)];
}

export function randomString(length: number = 10): string {
    return Array.from({length}, pickRandom).join('');
}

export function randomNumber(): number {
    return Math.random();
}

export function randomInt(limit: number): number {
    return Math.floor(Math.random() * limit);
}
