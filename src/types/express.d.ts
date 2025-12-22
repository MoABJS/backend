interface User {
  firstName: string;
  lastName: string;
  email: string;
}

declare namespace Express {
  interface Request {
    user?: User | null;
  }
}
