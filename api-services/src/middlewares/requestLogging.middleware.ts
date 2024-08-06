import { NextFunction, Request, Response } from "express";
import { Logger } from "../utils/logger";

export const requestLoggingMiddleware  = (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    const functionName = `Middleware.requestLoggingMiddleware`;
    logger.info(`Request - ${req.method} | ${req.path}`, functionName, req.requestId, {});
    next();
}