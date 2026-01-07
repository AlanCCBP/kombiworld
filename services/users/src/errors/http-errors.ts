export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserNotFoundError extends HttpError {
  constructor() {
    super('User not found', 404);
  }
}
