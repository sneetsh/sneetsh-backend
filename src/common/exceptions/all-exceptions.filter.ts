import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (process.env.NODE_ENV === 'development') console.log('ERROR: ', exception);

    response.status(status).json({
      message: exception?.response?.message || exception?.message,
      errors: exception.response?.error || exception?.error || 'An error occurred',
      status,
    });
  }
}
