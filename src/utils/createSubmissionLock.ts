export default function createSubmissionLock() {
  let active = false;

  return async function runOnce<T>(
    operation: () => Promise<T>,
  ): Promise<T | undefined> {
    if (active) return undefined;

    active = true;
    try {
      return await operation();
    } finally {
      active = false;
    }
  };
}
