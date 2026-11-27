/** Runs once when the server starts. Starts the built-in scheduler when it is switched on. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.BUILT_IN_SCHEDULER?.trim().toLowerCase() === 'true') {
    const { startBuiltInScheduler } = await import('./lib/scheduler');
    startBuiltInScheduler();
  }
}
