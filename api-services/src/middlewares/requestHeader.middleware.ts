import { NextFunction, Request, Response } from "express";
import { UuidGeneratorImpl } from "../utils/uuidGeneratorImpl";
import { Utils } from "../utils/utils";
import { Logger } from "../utils/logger";

export function requestHeaderMiddleware (uuidGenerator: UuidGeneratorImpl, logger: Logger) {
    return (req: Request, res: Response, next: NextFunction) => {
        const functionName = `Middleware.requestHeaderMiddleware`;

        logger.info(`Setting request headers!`, functionName, req.requestId, {});

        req.requestId = Utils.getValueOrDefault(req.header('x-request-id'), uuidGenerator.generateUuid());
        req.originalUri = Utils.getValueOrDefault(req.header('x-original-uri'), '');
        req.startTime = Date.now();
        req.apiVersion = Utils.getValueOrDefault(req.header('x-api-version'), 'default');
        
        logger.info(`RequestId: ${req.requestId} | OriginalURI: ${req.originalUri} | StartTime: ${req.startTime} | Api Version: ${req.apiVersion}`, functionName, "", {});

        next();
    }
}