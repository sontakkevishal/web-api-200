export function padSeconds(ms: number): number {
  return Math.floor((ms % (1000 * 60)) / 1000);
}

export function padMinutes(ms: number): number {
  return Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
}

export function padHours(ms: number): number {
  return Math.floor(ms / (1000 * 60 * 60));
}
