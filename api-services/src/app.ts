import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { configureContainer } from './container';
import { UserController } from './controllers/user.controller';
import { createErrorHandlingMiddleware } from './middlewares/errorHandling.middleware';
import { requestHeaderMiddleware } from './middlewares/requestHeader.middleware';
import { requestLoggingMiddleware } from './middlewares/requestLogging.middleware';
import { createSuccessResponseMiddleware } from './middlewares/successResponse.middleware';
import { UserRoutes } from './routers/user.router';
import { ServerConfig } from './utils/config';
import { Logger } from './utils/logger';
import { UuidGeneratorImpl } from './utils/uuidGeneratorImpl';

/**
 * Configures the Express application with middleware, routes, and error handling.
 *
 * @param {express.Application} app - The Express application instance to be configured.
 * @param {Container} container - The Inversify dependency injection container.
 * @param {Logger} logger - The logger instance used for logging in middleware and error handling.
 */
const configureApp = (
  app: express.Application,
  container: Container,
  logger: Logger,
): void => {
  // Configure Express application with middleware, routes, and error handling
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Create an instance of the UuidGenerator implementation for ctid
  const uuidGenerator = new UuidGeneratorImpl();

  // Middleware before handling requests
  app.use(requestHeaderMiddleware(uuidGenerator, logger));
  app.use(requestLoggingMiddleware(logger));

  app.get('/api/health', (req, res) => {
    res.status(200).send({
      success: true,
      message: 'OK'
    });
  });

  app.get('/test', (req, res) => {
    res.send('Server is running');
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', err);
    res.status(500).send('Something went wrong!');
  });

  // Register routes for UserController
  const userRoutes = new UserRoutes(
    container.get<UserController>(UserController), container.get<Logger>(Logger),
  );
  app.use('/api/user',userRoutes.initializeRoutes());

  // Middlewares for success and error responses
  app.use(createSuccessResponseMiddleware(logger));
  app.use(createErrorHandlingMiddleware(logger));
};

/**
 * Builds and returns a configured Express application.
 *
 * @param {Container} container - The Inversify dependency injection container.
 * @param {InversifyExpressServer} server - The InversifyExpressServer instance to build the application.
 * @param {Logger} logger - The logger instance used for logging in middleware and error handling.
 * @returns {express.Application} The configured Express application.
 */
const createApp = (
  container: Container,
  server: InversifyExpressServer,
  logger: Logger,
): express.Application => {
  /**
   * Configures middleware, routes, and error handling.
   *
   * @param {express.Application} app - The Express application.
   */
  server.setConfig((app: express.Application) => {
    configureApp(app, container, logger);
  });

  // Build and return the configured Express application
  return server.build();
};

/**
  * Configures the Express application with middleware, routes, and error handling.
  *
  * @param {express.Application} app - The Express application instance to be configured.
  * @param {Container} container - The Inversify dependency injection container.
  * @param {Logger} logger - The logger instance used for logging in middleware and error handling.
  */
const createContainer = () => {
  const container = configureContainer();
  const serverConfig = container.get<ServerConfig>(ServerConfig);
  const logger = container.get<Logger>(Logger);
  const server = new InversifyExpressServer(container);

  return {
    container, serverConfig, logger, server,
  };
};

/**
 * Builds and returns a configured Express application.
 *
 * @param {Container} container - The Inversify dependency injection container.
 * @param {InversifyExpressServer} server - The InversifyExpressServer instance to build the application.
 * @param {Logger} logger - The logger instance used for logging in middleware and error handling.
 * @returns {express.Application} The configured Express application.
 */
const createExpressApp = (container: Container, server: InversifyExpressServer, logger: Logger) => {
  const app = createApp(container, server, logger);
  return app;
};

/**
 * Handles application errors and logs the error message.
 *
 * @param {Logger} logger - The logger instance used for logging errors.
 * @param {unknown} error - The error object to be logged.
 */
const handleAppError = (logger: Logger, error: unknown) => {
  if (error instanceof Error) {
    logger.error(
      `Server error: ${error?.message}`,
      'app.ts/startServer/app.on',
      'null',
      error,
    );
  } else {
    logger.error(
      'Server error: Unknown error occurred',
      'app.ts/startServer/app.on',
      'null',
      error as Error,
    );
  }
};

/**
 * Starts the Express server and listens for incoming requests.
 */
const startServer = () => {
  const {
    container, serverConfig, logger, server,
  } = createContainer();
  const app = createExpressApp(container, server, logger);
  const port = serverConfig.getPort()

  try {
    app.listen(port, () => {
      logger.info(
        `API server is running on port ${port}`,
        'app.ts/startServer',
        'null',
        {},
      );
    });
  } catch (error: unknown) {
    handleAppError(logger, error);
  }

  // Handle asynchronous errors
  app.on('error', (error: unknown) => {
    handleAppError(logger, error);
  });
};

// Start the server if executed directly
if (require.main === module) {
  startServer();
}

export {
  configureApp, createApp, createContainer, createExpressApp, handleAppError, startServer,
};
