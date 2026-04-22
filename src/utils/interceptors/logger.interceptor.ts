import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, body } = request;
    const contentType = request.get('Content-Type');

    // Log JSON bodies for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method) && contentType?.includes('application/json')) {
      this.logger.log(`[${method}] ${originalUrl} - Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        // Optional: log response if needed
      }),
    );
  }
}