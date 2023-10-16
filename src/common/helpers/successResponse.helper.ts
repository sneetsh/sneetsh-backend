import { Logger, LoggerService } from "@nestjs/common";

export class SuccessResponse {
  message: string;
  data: unknown;
  status: string;

  constructor(message = "successful", data: unknown = null) {
    this.message = message;
    this.data = data;
    this.status = "success";
  }

  toJSON() {
    Logger.log(`(LOGS) Success - ${this.message}`);

    if (this.data) {
      return {
        status: this.status,
        message: this.message,
        data: this.data,
      };
    }

    return {
      status: this.status,
      message: this.message,
    };
  }
}
