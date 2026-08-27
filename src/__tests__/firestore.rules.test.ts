import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const ALICE = "alice-uid";
const BOB = "bob-uid";

let testEnv: RulesTestEnvironment;

// Verified-email tokens: what the app's own App.tsx gate produces.
const verified = (uid: string) =>
  testEnv.authenticatedContext(uid, { email_verified: true }).firestore();

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "espressowallet-rules-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe("userData metadata document", () => {
  it("lets a verified owner read and write their own document", async () => {
    const db = verified(ALICE);
    await assertSucceeds(
      setDoc(doc(db, "userData", ALICE), { currency: "USD", balance: 0 })
    );
    await assertSucceeds(getDoc(doc(db, "userData", ALICE)));
  });

  it("stops a verified user reading someone else's document", async () => {
    // Seed Alice's data bypassing rules, then have Bob try to read it.
    await testEnv.withSecurityRulesDisabled(async ctx => {
      await setDoc(doc(ctx.firestore(), "userData", ALICE), {
        currency: "USD",
        balance: 1000,
      });
    });

    const db = verified(BOB);
    await assertFails(getDoc(doc(db, "userData", ALICE)));
  });

  it("stops a verified user writing to someone else's document", async () => {
    const db = verified(BOB);
    await assertFails(
      setDoc(doc(db, "userData", ALICE), { balance: 999999 })
    );
  });
});

describe("transaction subcollections", () => {
  it("lets a verified owner write their own expenses and incomes", async () => {
    const db = verified(ALICE);
    await assertSucceeds(
      setDoc(doc(db, "userData", ALICE, "expenses", "e1"), { value: 10 })
    );
    await assertSucceeds(
      setDoc(doc(db, "userData", ALICE, "incomes", "i1"), { value: 20 })
    );
  });

  it("stops a verified user reading someone else's transactions", async () => {
    await testEnv.withSecurityRulesDisabled(async ctx => {
      await setDoc(doc(ctx.firestore(), "userData", ALICE, "expenses", "e1"), {
        value: 10,
        description: "private",
      });
    });

    const db = verified(BOB);
    await assertFails(getDoc(doc(db, "userData", ALICE, "expenses", "e1")));
  });

  it("stops a verified user writing into someone else's transactions", async () => {
    const db = verified(BOB);
    await assertFails(
      setDoc(doc(db, "userData", ALICE, "expenses", "injected"), { value: 1 })
    );
  });
});

describe("authentication requirements", () => {
  it("denies unauthenticated reads and writes", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "userData", ALICE)));
    await assertFails(setDoc(doc(db, "userData", ALICE), { balance: 1 }));
  });

  it("denies a signed-in but unverified user, even on their own data", async () => {
    const db = testEnv
      .authenticatedContext(ALICE, { email_verified: false })
      .firestore();
    await assertFails(getDoc(doc(db, "userData", ALICE)));
    await assertFails(setDoc(doc(db, "userData", ALICE), { balance: 1 }));
  });
});
