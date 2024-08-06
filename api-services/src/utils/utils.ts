export class Utils {
    static getValueOrDefault<T> (value: T | undefined | null, defaultValue: T): T {
        return value !== undefined && value !== null ? value : defaultValue;
    }
}