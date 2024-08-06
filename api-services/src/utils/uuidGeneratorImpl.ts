import { v4 as uuidv4 } from 'uuid';
import { UuidGenerator } from "../interfaces/utils.interface";

export class UuidGeneratorImpl implements UuidGenerator {
    generateUuid(): string {
        this.toString();
        return uuidv4();
    }
}