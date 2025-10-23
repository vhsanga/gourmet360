import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import * as chalk from 'chalk';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Error interno del servidor';
    const fecha = new Date();
    const timestamp = fecha.toISOString();
    const idRequest = fecha.getTime();

    // 🔹 Caso 1: Errores de NestJS (HttpException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      message = typeof resp === 'string' ? resp : (resp as any).message ?? resp.toString();
    }

    // 🔹 Caso 2: Error de validación o entidad no encontrada
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'El recurso solicitado no existe o fue eliminado.';
    }

    // 🔹 Caso 3: Error de consultas SQL (violación de constraint, FK, duplicado, etc)
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const err = exception as QueryFailedError & { code?: string; sqlMessage?: string };
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          message = 'El registro ya existe (clave duplicada).';
          break;
        case 'ER_NO_REFERENCED_ROW_2':
          message = 'Violación de clave foránea.';
          break;
        default:
          message = err.message || 'Error en la consulta SQL.';
          break;
      }
    }

    // 🔹 Caso 4: Otros errores genéricos de JS
    else if (exception instanceof Error) {
      message = exception.message || message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // 📋 Log detallado del error
    this.logger.error(
      `[${request.method} ${request.url}] [idRequest: ${idRequest}] Error: ${message}`,
    );

    const stack = (exception as any)?.stack
      ? (exception as any).stack.split('\n').slice(1, 3).join('\n')
      : 'No stack trace disponible';

    this.logger.error(chalk.red.bold(`\n[Tracking]:\n${stack}\n`));

    // 🔹 Respuesta uniforme
    response.status(status).json({
      ok: false,
      mensaje: message,
      statusCode: status,
      timestamp,
      path: request.url,
      idRequest,
    });
  }
}
