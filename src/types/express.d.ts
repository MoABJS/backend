import { AuthPayload } from "./auth"; // adjust path to your AuthPayload

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}


export {};
