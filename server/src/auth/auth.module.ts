import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
