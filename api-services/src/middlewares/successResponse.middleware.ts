import { NextFunction, Request, Response } from "express";
import { HttpSuccessCode } from "../enums/utils.enum";
import { SuccessResponse } from "../interfaces/utils.interface";
import { Logger } from "../utils/logger";
import { AppSuccess } from "../utils/appSuccess";

const successMapping = {
    OK: 200,
    CREATED: 201,
    DELETED: 204,
    NO_CONTENT: 204
};

export function createSuccessResponse (statusCode: HttpSuccessCode, message: string, data: object) {
    const status = successMapping[statusCode] || 200;

    return {
        success: true,
        status,
        message,
        data
    };
}

export function createSuccessResponseMiddleware (logger: Logger) {
    return function successResponseMiddleware(
        successResponse: SuccessResponse,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const execTime: number = Date.now() - req.startTime;
        if (successResponse instanceof AppSuccess) {
            try {
                const successData = createSuccessResponse(
                    successResponse.code as HttpSuccessCode,
                    successResponse.message,
                    successResponse.data
                );

                res.setHeader('Content-Type', 'application/json; charset=utf-8');

                if (successResponse.header) {
                    const headerData = successResponse.header.data;
                    if (headerData) {
                        const headersToSet = successResponse.header.cookie ? res.cookie : res.setHeader;
                        Object.entries(headerData).forEach(([key, value]) => {
                            headersToSet.call(res, key, value);
                        });
                    }
                }

                logger.debug(`Response (Success) - ${req.method} | ${req.path} - Exec time: ${execTime} ms, `
                    + `HTTP Status Code: ${successData.status}, `
                    + `Message: ${successData.message}`, 
                    `Middleware.successResponseMiddleware`, 
                    req.requestId, 
                    {
                        successData: successResponse.data,
                        successHeader: successResponse.header,
                        originalUri: req.originalUri
                    }
                );

                logger.info(`Response (Success) - ${req.method} | ${req.path} - Exec time: ${execTime} ms, `
                    + `HTTP Status Code: ${successData.status}, `
                    + `Message: ${successData.message}`, 
                    `Middleware.successResponseMiddleware`, 
                    req.requestId, 
                    {
                        originalUri: req.originalUri
                    }
                );

                if (successData.status === 204) {
                    res.status(successData.status).send();
                } else {
                    const responseData = (req.apiVersion === 'legacy')
                        ? successData.data
                        : {
                            success: successData.success,
                            message: successData.message,
                            data: successData.data
                        };
                    res.status(successData.status).json(responseData);
                }
            } catch (error: any) {
                logger.error(`Error generating success response.`, `Middleware.successResponseMiddleware`, req.requestId, error as Error);
                next (error);
            }
        } else {
            next(successResponse);
        }
    }
}