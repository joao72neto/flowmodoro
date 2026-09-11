import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import backupService from "./backup.service";
import { localStorageKeys } from "../../shared/utils/storage.utils";

jest.mock("./api/backup.api", () => ({
  importBackupApi: jest.fn(),
}));

jest.mock("../../local/sync/pull-manager", () => ({
  executePull: jest.fn(),
}));

describe("BackupService Client Validation", () => {
  const mockUserId = crypto.randomUUID();
  let storage: Record<string, string> = {};

  beforeEach(() => {
    jest.clearAllMocks();
    storage = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
    };
    Object.defineProperty(globalThis, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    localStorage.setItem(
      localStorageKeys.authUser,
      JSON.stringify({ id: mockUserId }),
    );
  });

  const createMockFile = (content: string, size?: number): File => {
    return {
      size: size ?? content.length,
      text: async () => content,
    } as unknown as File;
  };

  test("should reject files larger than 5MB", async () => {
    const largeFile = createMockFile("dummy", 6 * 1024 * 1024);

    await expect(backupService.importData(largeFile)).rejects.toThrow(
      "Arquivo muito grande. O tamanho máximo permitido é de 5MB.",
    );
  });

  test("should reject invalid JSON content", async () => {
    const invalidJsonFile = createMockFile("{ invalid json content");

    await expect(backupService.importData(invalidJsonFile)).rejects.toThrow(
      "Arquivo inválido: não é um JSON válido.",
    );
  });

  test("should reject schema validation failure", async () => {
    const invalidSchemaFile = createMockFile(
      JSON.stringify({
        userId: mockUserId,
        projects: [{ id: "not-a-uuid", name: "Project" }],
        tags: [],
        sessions: [],
      }),
    );

    await expect(backupService.importData(invalidSchemaFile)).rejects.toThrow(
      /Arquivo inválido:/,
    );
  });

  test("should reject userId mismatch", async () => {
    const otherUserId = crypto.randomUUID();
    const mismatchedUserFile = createMockFile(
      JSON.stringify({
        userId: otherUserId,
        projects: [],
        tags: [],
        sessions: [],
      }),
    );

    await expect(backupService.importData(mismatchedUserFile)).rejects.toThrow(
      "id do usuário não corresponde ao id do usuário logado",
    );
  });
});
