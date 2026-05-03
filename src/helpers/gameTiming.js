// Helper function to compute elapsed ticks based on last processed time and current time
export const computeElapsedTicks = (lastProcessedAt, currentTime, tickMs = 1000) => {
  if (!lastProcessedAt || lastProcessedAt === null) {
    return { elapsedTicks: 0, nextProcessedAt: currentTime };
  }

  // TODO - make sure this doesn't advance time when it shouldn't
  // (e.g. when system clock changes or tab is suspended)
  if (currentTime <= lastProcessedAt) {
    return { elapsedTicks: 0, nextProcessedAt: lastProcessedAt };
  }

  const elapsedTime = currentTime - lastProcessedAt;
  const elapsedTicks = Math.floor(elapsedTime / tickMs);

  return { elapsedTicks, nextProcessedAt: lastProcessedAt + elapsedTicks * tickMs };
}

// Helper function to initialize last processed time based on saved last tick or fallback to current time
export const initializeProcessedAt = (savedLastTick, fallbackNow) => {
  const saved = Number.isFinite(savedLastTick) ? savedLastTick : 0;
  return saved > 0 ? saved : fallbackNow;
}
