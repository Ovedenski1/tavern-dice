export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}