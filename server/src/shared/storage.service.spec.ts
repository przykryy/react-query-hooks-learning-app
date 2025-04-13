import { Test, TestingModule } from "@nestjs/testing";
import { StorageService } from "./storage.service";

describe("StorageService", () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  describe("User methods", () => {
    it("should create a user successfully", async () => {
      const mockUserData = {
        username: "testuser",
        password: "testpass",
      };

      const user = await service.createUser(mockUserData);

      expect(user).toEqual({
        id: expect.any(Number),
        ...mockUserData,
      });
    });

    it("should get user by id", async () => {
      const mockUserData = {
        username: "testuser",
        password: "testpass",
      };

      const createdUser = await service.createUser(mockUserData);
      const user = await service.getUser(createdUser.id);

      expect(user).toEqual(createdUser);
    });

    it("should get user by username", async () => {
      const mockUserData = {
        username: "testuser",
        password: "testpass",
      };

      const createdUser = await service.createUser(mockUserData);
      const user = await service.getUserByUsername(mockUserData.username);

      expect(user).toEqual(createdUser);
    });
  });

  describe("Progress methods", () => {
    it("should get user progress", async () => {
      const userId = 1;
      const progress = await service.getUserProgress(userId);

      expect(progress).toEqual([]);
    });

    it("should update user progress", async () => {
      const mockProgressData = {
        userId: 1,
        tutorialId: "tutorial-1",
        completed: true,
        quizCompleted: true,
        lastViewed: new Date(),
      };

      const progress = await service.updateUserProgress(mockProgressData);

      expect(progress).toEqual({
        id: expect.any(Number),
        ...mockProgressData,
      });
    });

    it("should update existing progress", async () => {
      const mockProgressData = {
        userId: 1,
        tutorialId: "tutorial-1",
        completed: true,
        quizCompleted: true,
        lastViewed: new Date(),
      };

      const firstProgress = await service.updateUserProgress(mockProgressData);
      const updatedProgress = await service.updateUserProgress({
        ...mockProgressData,
        completed: false,
      });

      expect(updatedProgress).toEqual({
        ...firstProgress,
        completed: false,
      });
    });
  });

  describe("Quiz attempt methods", () => {
    it("should save quiz attempt", async () => {
      const mockAttemptData = {
        userId: 1,
        tutorialId: "tutorial-1",
        score: 80,
        totalQuestions: 10,
        attemptedAt: new Date(),
      };

      const attempt = await service.saveQuizAttempt(mockAttemptData);

      expect(attempt).toEqual({
        id: expect.any(Number),
        ...mockAttemptData,
      });
    });

    it("should get quiz attempts", async () => {
      const mockAttemptData = {
        userId: 1,
        tutorialId: "tutorial-1",
        score: 80,
        totalQuestions: 10,
        attemptedAt: new Date(),
      };

      const savedAttempt = await service.saveQuizAttempt(mockAttemptData);
      const attempts = await service.getQuizAttempts(1, "tutorial-1");

      expect(attempts).toEqual([savedAttempt]);
    });

    it("should update progress when saving quiz attempt", async () => {
      const mockAttemptData = {
        userId: 1,
        tutorialId: "tutorial-1",
        score: 80,
        totalQuestions: 10,
        attemptedAt: new Date(),
      };

      await service.saveQuizAttempt(mockAttemptData);
      const progress = await service.getUserProgress(1);

      expect(progress[0]).toEqual({
        id: expect.any(Number),
        userId: 1,
        tutorialId: "tutorial-1",
        completed: true,
        quizCompleted: true,
        lastViewed: mockAttemptData.attemptedAt,
      });
    });
  });
});
