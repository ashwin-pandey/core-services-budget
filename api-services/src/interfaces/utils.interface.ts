export interface UuidGenerator {
    generateUuid(): string;
}

export interface LoggerConfiguration {
    applicationName: string;
    appenders: {
        file: {
            type: string;
            fileName: string;
            maxLogSize: number;
            backUps: number;
        };
        console: {
            type: string;
        };
    };
    categories: {
        default: {
            appenders: string[];
            level: string;
        };
    };
}

export interface ServerConfiguration {
    port: number;
    env: string;
}

export interface SuccessResponseData {}

export interface SuccessResponseHeader {
    header?: boolean;
    cookie?: boolean;
    data?: object;
}

export interface SuccessResponse {
    name: string;
    code: string;
    message: string;
    data: SuccessResponseData;
    header: SuccessResponseHeader;
}

export interface CustomError {
    errorCode: string;
    errorDescription: string;
    errorDetails: object;
}