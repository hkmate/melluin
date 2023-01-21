export class Base64 {

    public static encode(raw: string): string {
        return Buffer.from(raw).toString('base64');
    }

    public static decode(encoded: string): string {
        return Buffer.from(encoded, 'base64').toString('utf8');
    }

}
