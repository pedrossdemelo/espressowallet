import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExchangeRates, Transaction, TransactionWithId } from "../../types";

const mocks = vi.hoisted(() => {
  const batch = {
    set: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  };

  return { batch };
});

function reference(path: string) {
  return {
    path,
    withConverter() {
      return this;
    },
  };
}

vi.mock("../firebase", () => ({
  auth: { currentUser: { uid: "user-1" } },
  db: {},
}));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn((...parts: unknown[]) =>
    reference(parts.slice(1).join("/")),
  ),
  doc: vi.fn((...parts: unknown[]) => {
    if (parts.length === 1) {
      const collection = parts[0] as { path: string };
      return reference(`${collection.path}/generated-id`);
    }
    return reference(parts.slice(1).join("/"));
  }),
  increment: vi.fn((value: number) => ({ increment: value })),
  writeBatch: vi.fn(() => mocks.batch),
}));

import addTransaction from "../addTransaction";
import deleteTransaction from "../deleteTransaction";
import editTransaction from "../editTransaction";

const rates = { USD: 1 } as ExchangeRates;

function transaction(
  overrides: Partial<TransactionWithId> = {},
): TransactionWithId {
  return {
    id: "transaction-1",
    tag: "Other",
    description: "Coffee",
    value: 10,
    currency: "USD",
    baseCurrency: "USD",
    createdAt: new Date(2026, 6, 9),
    type: "expense",
    exchangeRates: rates,
    ...overrides,
  };
}

describe("transaction write metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.batch.commit.mockResolvedValue(undefined);
  });

  it("adds a transaction and its aggregate changes in one batch", async () => {
    const expense = transaction();
    const { id: _id, ...storedExpense } = expense;

    await addTransaction(storedExpense as Transaction);

    expect(mocks.batch.set).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "userData/user-1/expenses/generated-id",
      }),
      storedExpense,
    );
    expect(mocks.batch.set).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ path: "userData/user-1" }),
      {
        balance: { increment: -10 },
        "7/2026": {
          balance: { increment: -10 },
          expenses: { increment: 1 },
          totalExpense: { increment: 10 },
        },
      },
      { merge: true },
    );
    expect(mocks.batch.commit).toHaveBeenCalledOnce();
  });

  it("moves aggregate values between months when a date is edited", async () => {
    const oldExpense = transaction();
    const updatedExpense = transaction({
      value: 15,
      createdAt: new Date(2026, 7, 1),
    });

    await editTransaction(oldExpense, updatedExpense);

    expect(mocks.batch.set).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ path: "userData/user-1" }),
      {
        balance: { increment: -5 },
        "8/2026": {
          balance: { increment: -15 },
          expenses: { increment: 1 },
          totalExpense: { increment: 15 },
        },
        "7/2026": {
          balance: { increment: 10 },
          expenses: { increment: -1 },
          totalExpense: { increment: -10 },
        },
      },
      { merge: true },
    );
  });

  it("reverses aggregate values when deleting a transaction", async () => {
    const income = transaction({ type: "income", value: 25 });

    await deleteTransaction(income);

    expect(mocks.batch.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "userData/user-1/incomes/transaction-1",
      }),
    );
    expect(mocks.batch.set).toHaveBeenCalledWith(
      expect.objectContaining({ path: "userData/user-1" }),
      {
        balance: { increment: -25 },
        "7/2026": {
          balance: { increment: -25 },
          incomes: { increment: -1 },
          totalIncome: { increment: -25 },
        },
      },
      { merge: true },
    );
  });
});
