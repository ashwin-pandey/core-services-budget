import * as path from 'path';
import * as fs from 'fs';

import { injectable } from "inversify";
import { LoggerConfiguration } from "../interfaces/utils.interface";

/**
 * A class to read and validate logger configuration from a JSON file.
 */
@injectable()
export class LoggerConfigReader {
    private config: LoggerConfiguration;

    /**
     * Create an instance of LoggerConfigReader.
     */
    constructor() {
        this.config = {} as LoggerConfiguration;
        this.loadConfig();
        this.validateConfig();
    }

    /**
     * Loads logger configuration from the JSON file.
     */
    private loadConfig(): void {
        try {
            const configFilepath: string = path.join(__dirname, '../../config/logger.config.json');
            const rawConfig: string = fs.readFileSync(configFilepath, 'utf8');
            this.config = JSON.parse(rawConfig);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error (`Failed to load logger.config.json : ${error?.message}`);
            } else {
                throw new Error (`Failed to load logger.config.json. Unknown Error : ${error}`);
            }
        }
    }

    /**
     * Validates the loaded logger configuration.
     */
    private validateConfig(): void {
        if (!this.config || typeof this.config !== 'object') {
            throw new Error (`Invalid logger.config.json : Configuration must be an object.`);
        } 
        if (!this.config.appenders || !this.config.categories) {
            throw new Error (`Invalid logger.config.json : Missing required properties - appenders and categories.`);
        }
    }

    /**
     * Exports the loaded logger configuration as a JavaScript object.
     * 
     * @returns {LoggerConfiguration} The logger configuration.
     */
    exportAsJavaScript(): LoggerConfiguration {
        return this.config;
    }
}