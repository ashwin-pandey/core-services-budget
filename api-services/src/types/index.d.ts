export {}

declare global {
    namespace Express {
        interface Request {
            requestId: string;
            originalUri: string;
            startTime: number;
            apiVersion: string;
        }
    }
}