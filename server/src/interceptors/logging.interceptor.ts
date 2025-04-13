import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { log } from "../vite/vite.utils";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const path = req.path;

    // Only log API requests
    if (!path.startsWith("/api")) {
      return next.handle();
    }

    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - start;

        let logLine = `${req.method} ${path} ${response.statusCode} in ${duration}ms`;

        if (data) {
          logLine += ` :: ${JSON.stringify(data)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      })
    );
  }
}
