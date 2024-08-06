import { inject, injectable } from "inversify";
import { ServerConfiguration } from "../interfaces/utils.interface";
import { ServerConfigReader } from "../configs/server.config";

@injectable()
export class ServerConfig {
    private config: ServerConfiguration;

    constructor (@inject(ServerConfigReader) configReader: ServerConfigReader) {
        try {
            this.config = configReader.exportAsJavaScript();
        } catch (error) {
            throw new Error (`Failed to load or validate server configuration.`);
        }
    }

    getPort(): number {
        return this.config.port;
    }

    getEnv(): string {
        return this.config.env;
    }
}