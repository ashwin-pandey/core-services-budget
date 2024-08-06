import * as path from 'path';
import * as fs from 'fs';

import { injectable } from "inversify";
import { ServerConfiguration } from "../interfaces/utils.interface";
import minimist from 'minimist';

@injectable()
export class ServerConfigReader {
    private config: ServerConfiguration;

    constructor() {
        this.config = {} as ServerConfiguration;
        this.loadConfig();
        this.validateConfig();
    }

    /**
     * Loads server configuration from the JSON file.
     */
    private loadConfig(): void {
        const args = minimist(process.argv.slice(2));

        // Default config file path
        let configFilePath = 'config/server.config.json';

        if (args.config) {
            // If --config option is provided in the CLI, use it as the config file path
            configFilePath = args.config as string;
        }
        
        try {
            const scriptDirectory = __dirname;
            const resolvePath = path.resolve(scriptDirectory, '../../', configFilePath);
            const rawConfig: string = fs.readFileSync(resolvePath, 'utf8');
            this.config = JSON.parse(rawConfig) as ServerConfiguration;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error (`Failed to load server.config.json : ${error?.message}`);
            } else {
                throw new Error (`Failed to load server.config.json. Unknown Error : ${error}`);
            }
        }
    }

    /**
     * Validates the loaded server configuration.
     */
    private validateConfig(): void {
        if (!this.config || typeof this.config !== 'object') {
            throw new Error (`Invalid server.config.json : Configuration must be an object.`);
        } 
        // if (!this.config.port || typeof !this.config.port !== 'number') {
        if (!this.config.port) {
            throw new Error (`Invalid server.config.json : Missing or invalid 'port' property.`);
        }
    }

    /**
     * Exports the loaded server configuration as a JavaScript object.
     * 
     * @returns {ServerConfiguration} The logger configuration.
     */
    exportAsJavaScript(): ServerConfiguration {
        return this.config;
    }
}