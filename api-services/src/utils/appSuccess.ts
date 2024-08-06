import { SuccessResponseData, SuccessResponseHeader } from "../interfaces/utils.interface";

export class AppSuccess {
    public name: string;
    public code: string;
    public message: string;
    public data: SuccessResponseData;
    public header: SuccessResponseHeader;

    constructor (code: string, message: string, data?: any, header?: any) {
        this.name = 'AppSuccess';
        this.code = code;
        this.message = message;
        this.data = data;
        this.header = header;
    }
}