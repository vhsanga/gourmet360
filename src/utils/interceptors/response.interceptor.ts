import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest<Request>();

        const mensaje = data?.mensaje || 'Operación exitosa';
        const payload = data?.data;

        const fecha = new Date();
        const idRequest = fecha.getTime()
        this.logger.log(
            `[${request.method} ${request.url}] [idRequest: ${idRequest}] Ok: ${mensaje}`,
        );

        return {
          ok: true,
          statusCode: response.statusCode,
          mensaje,
          timestamp: fecha.toISOString(),
          data: payload,
          idRequest: idRequest,
        };
      }),
    );
  }
}
