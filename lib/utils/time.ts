export function formatTimeRemaining(expiresAt: Date):string {
  const now = new Date();
  const timeLeft = expiresAt.getTime() - now.getTime();

  if(timeLeft <= 0) return "Expired";

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function isDebateExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function canEditArgument(createdAt: Date): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return createdAt > fiveMinutesAgo
}