const MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

export function formatRelativeTime(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / MS.SECOND);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(diffMs / MS.MINUTE);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(diffMs / MS.HOUR);
  if (hours < 24) return `${hours}h`;

  const utcNowDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcDateDay = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.floor((utcNowDay - utcDateDay) / MS.DAY);

  if (dayDiff === 1) return 'yesterday';

  return dayDiff + 'D';

  // return date.toLocaleString("en-US", {
  //   dateStyle: "medium",
  //   timeStyle: "short",
  // });
}
