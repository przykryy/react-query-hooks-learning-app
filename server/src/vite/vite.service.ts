import { Injectable } from "@nestjs/common";
import { Express } from "express";
import { Server } from "http";
import { setupVite, serveStatic, log } from "./vite.utils";

@Injectable()
export class ViteService {
  async setupVite(app: Express, server: Server): Promise<void> {
    return setupVite(app, server);
  }

  serveStatic(app: Express): void {
    return serveStatic(app);
  }

  log(message: string, source = "express"): void {
    log(message, source);
  }
}
