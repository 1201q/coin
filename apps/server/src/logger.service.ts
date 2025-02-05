import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";
import "winston-daily-rotate-file";

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level.toUpperCase()}] ${message}`,
        ),
      ),
      transports: [
        new winston.transports.Console(), // 터미널 로그
        new winston.transports.DailyRotateFile({
          dirname: "logs",
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "14d", // 14일간 로그 보관
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace?: string) {
    this.logger.error(`${message} \nTrace: ${trace}`);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
}
