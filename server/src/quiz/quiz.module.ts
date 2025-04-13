import { Module } from "@nestjs/common";
import { QuizController } from "./quiz.controller";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [QuizController],
  providers: [],
})
export class QuizModule {}
