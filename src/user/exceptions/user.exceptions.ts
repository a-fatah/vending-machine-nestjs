import { HttpException } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(`User with username '${username}' already exists`, 409);
  }
}