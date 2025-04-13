const { Test, TestingModule } = require("@nestjs/testing");
const { QuizController } = require("./quiz.controller");
const { StorageService } = require("../shared/storage.service");
const { HttpException, HttpStatus } = require("@nestjs/common");

describe("QuizController", () => {
  /** @type {QuizController} */
  let controller: typeof QuizController;
  /** @type {StorageService} */
  let storageService: typeof StorageService;

  const mockStorageService = {
    saveQuizAttempt: jest.fn(),
    getQuizAttempts: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get(QuizController);
    storageService = module.get(StorageService);
  });

  describe("saveAttempt", () => {
    it("should save a quiz attempt successfully", async () => {
      const mockQuizData = {
        userId: 1,
        tutorialId: "tutorial-1",
        score: 80,
        totalQuestions: 10,
        attemptedAt: new Date(),
      };

      const mockSavedAttempt = {
        id: 1,
        ...mockQuizData,
      };

      mockStorageService.saveQuizAttempt.mockResolvedValue(mockSavedAttempt);

      const result = await controller.saveAttempt(mockQuizData);

      expect(result).toEqual(mockSavedAttempt);
      expect(storageService.saveQuizAttempt).toHaveBeenCalledWith(mockQuizData);
    });

    it("should throw an HttpException when save fails", async () => {
      const mockQuizData = {
        userId: 1,
        tutorialId: "tutorial-1",
        score: 80,
        totalQuestions: 10,
        attemptedAt: new Date(),
      };

      const errorMessage = "Failed to save quiz attempt";
      mockStorageService.saveQuizAttempt.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(controller.saveAttempt(mockQuizData)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe("getAttempts", () => {
    it("should return quiz attempts for a user and tutorial", async () => {
      const userId = "1";
      const tutorialId = "tutorial-1";
      const mockAttempts = [
        {
          id: 1,
          userId: 1,
          tutorialId,
          score: 80,
          totalQuestions: 10,
          attemptedAt: new Date(),
        },
      ];

      mockStorageService.getQuizAttempts.mockResolvedValue(mockAttempts);

      const result = await controller.getAttempts(userId, tutorialId);

      expect(result).toEqual(mockAttempts);
      expect(storageService.getQuizAttempts).toHaveBeenCalledWith(
        parseInt(userId),
        tutorialId
      );
    });

    it("should throw an HttpException when get attempts fails", async () => {
      const userId = "1";
      const tutorialId = "tutorial-1";
      const errorMessage = "Failed to get quiz attempts";

      mockStorageService.getQuizAttempts.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(controller.getAttempts(userId, tutorialId)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});
