import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { UserController } from "../controllers/user.controller";
import { Logger } from "../utils/logger";

@injectable()
export class UserRoutes {
    private router: Router;
    private userController: UserController;

    constructor (
        @inject(UserController) userController: UserController,
        @inject(Logger) private logger: Logger
    ) {
        this.router = Router();
        this.userController = userController;
        this.initializeRoutes();
    }

    public initializeRoutes(): Router {
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            
        });

        return this.router;
    }

}