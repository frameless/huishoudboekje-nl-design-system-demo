declare module 'express' {
    interface Request {
        session: Express.SessionData; // Use Express.SessionData
    }
}