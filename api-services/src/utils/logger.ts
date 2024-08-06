import { inject, injectable } from "inversify";
import * as log4js from "log4js";
import { LoggerConfigReader } from "../configs/logger.config";

@injectable()
export class Logger {
    private logger: log4js.Logger;
    private applicationName: string;

    constructor (@inject(LoggerConfigReader) configReader: LoggerConfigReader) {
        const log4jsConfig = configReader.exportAsJavaScript();
        log4js.configure(log4jsConfig);
        this.logger = log4js.getLogger('default');
        this.applicationName = log4jsConfig.applicationName;
    }

    private formatLogMessage (message: string, module: string, requestId?: string, customData: object = {}): string {
        const logData = {
            msg: message,
            module,
            app: this.applicationName,
            reqId: requestId,
            customData: JSON.stringify(customData)
        }
        return Object.entries(logData).filter(([, value]) => value != undefined).map(([key, value]) => `${key}=${value}`).join(', ');
    }

    /**
     * Logs a trace message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    trace(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.trace(logMessage);
    }

    /**
     * Logs a debug message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    debug(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.debug(logMessage);
    }

    /**
     * Logs an info message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    info(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.info(logMessage);
    }

    /**
     * Logs a warning message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    warn(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.warn(logMessage);
    }

    /**
     * Logs an error message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    error(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.error(logMessage);
    }

    /**
     * Logs a fatal message
     * 
     * @param message 
     * @param module 
     * @param requestId 
     * @param customData 
     */
    fatal(message: string, module: string, requestId: string, customData: object) {
        const logMessage = this.formatLogMessage(message, module, requestId, customData);
        this.logger.fatal(logMessage);
    }
}