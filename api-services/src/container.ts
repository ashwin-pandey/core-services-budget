import 'reflect-metadata';
import { Container } from 'inversify';
import { ServerConfig } from './utils/config';
import { ServerConfigReader } from './configs/server.config';
import { Logger } from './utils/logger';
import { LoggerConfigReader } from './configs/logger.config';
import { UuidGeneratorImpl } from './utils/uuidGeneratorImpl';
import { UserController } from './controllers/user.controller';

function configureContainer(): Container {
    const container = new Container ();

    container.bind<UserController>(UserController).toSelf();

    container.bind<ServerConfig>(ServerConfig).toSelf().inSingletonScope();
    container.bind<ServerConfigReader>(ServerConfigReader).toSelf().inSingletonScope();
    container.bind<Logger>(Logger).toSelf().inSingletonScope();
    container.bind<LoggerConfigReader>(LoggerConfigReader).toSelf().inSingletonScope();
    
    container.bind<UuidGeneratorImpl>(UuidGeneratorImpl).toSelf().inSingletonScope();

    return container;
    
}

export { configureContainer };
