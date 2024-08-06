import { CustomError } from "../interfaces/utils.interface";

export class AppError extends Error implements CustomError {
    public errorCode: string;
    public message: string;
    public errorDescription: string;
    public errorDetails: object;

    constructor(errorCode: string, message: string, errorDescription: string, details?: any) {
        super(message);
        this.name = 'AppError';
        this.message = message;
        this.errorDescription = errorDescription;
        this.errorCode = errorCode;
        this.errorDetails = details;
    }
}