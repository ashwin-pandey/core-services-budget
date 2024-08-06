import { NextFunction, Request, Response } from "express";
import { Logger } from "../utils/logger";
import { HttpErrorCode } from "../enums/utils.enum";
import { AppError } from "../utils/appError";

const errorMapping: Record<HttpErrorCode, number> = {
    INVALID_INPUT: 400,
    AUTHORIZATION_FAILED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    DUPLICATE_ENTRY: 409,
    DB_CONNECTION_ERROR: 500,
    INTERNAL_SERVER_ERROR: 500,
    UNKNOWN_ERROR: 500,
    TOO_MANY_REQUESTS: 429
}

export function createErrorResponse (
    errorCode: HttpErrorCode,
    message: string,
    errorDesctiption: string,
    requestId: string,
    errorDetails?: object
) {
    const statusCode = errorMapping[errorCode] || 500;

    const errorResponse = {
        success: false,
        status: statusCode,
        code: errorCode,
        message,
        description: errorDesctiption,
        details: errorDetails || {},
        requestId,
        timestamp: new Date().toISOString()
    }

    return errorResponse;
}

export function checkErrorResponse (statusCode: string) {
    return statusCode in errorMapping;
}

export function createErrorHandlingMiddleware (logger: Logger) {
    return function errorHandlingMiddleware (err: Error, req: Request, res: Response, next: NextFunction) {
        const execTime: number = Date.now() - req.startTime;
        
        let errorResponse = {
            success: false,
            status: 500,
            code: HttpErrorCode.INTERNAL_SEVER_ERROR,
            message: `An unexpected error occurred.`,
            description: err.message,
            details: {},
            requestId: req.requestId,
            timestamp: new Date().toISOString()
        }

        res.set(`Content-Type`, `application/json; charset=utf-8`);

        if (err instanceof AppError) {
            errorResponse = createErrorResponse(
                err.errorCode as HttpErrorCode,
                err.message,
                err.errorDescription,
                req.requestId,
                err.errorDetails
            );
            res.set({
                'Content-Type': 'application/json; charset=utf-8',
                'x-message': errorResponse.message,
                'x-description': errorResponse.description,
                'x-iso-date': errorResponse.timestamp
            });
        }

        logger.error(
            `Response (Error) = ${req.method} | ${req.path} - Exec time: ${execTime} ms, `
                + `HTTP Status Code: ${errorResponse.status}, `
                + `Message: ${errorResponse.message}`,
            `Middleware.errorHandlingMiddleware`,
            req.requestId, 
            {
                errorDescription: errorResponse.description,
                errorDetails: errorResponse.details,
                originalUri: req.originalUri
            }
        );

        res.status(errorResponse.status).json(errorResponse);
    }
}