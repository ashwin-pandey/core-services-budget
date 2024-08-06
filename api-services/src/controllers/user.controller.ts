import { inject } from "inversify";
import { controller } from "inversify-express-utils";
import { Logger } from "../utils/logger";

@controller('/api/user')
export class UserController {

    private logger: Logger;

    constructor (
        @inject(Logger) logger: Logger
    ) {
        this.logger =logger;
    }

}