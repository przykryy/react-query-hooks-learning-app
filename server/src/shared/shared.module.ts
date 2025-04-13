import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { LoggerService } from "./logger.service";

@Module({
  providers: [StorageService, LoggerService],
  exports: [StorageService, LoggerService],
})
export class SharedModule {}
