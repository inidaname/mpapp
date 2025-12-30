// username.helper.ts
const ADJECTIVES = [
  'brave',
  'silent',
  'swift',
  'clever',
  'iron',
  'wild',
  'shadow',
  'ancient',
  'bold',
];

const NOUNS = [
  'lion',
  'eagle',
  'tiger',
  'wolf',
  'fox',
  'hawk',
  'panther',
  'dragon',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(length = 3): string {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  ).toString();
}

export function generateUsername(options?: {
  separator?: string;
  withNumber?: boolean;
}): string {
  const separator = options?.separator ?? '_';
  const withNumber = options?.withNumber ?? true;

  const base = [randomItem(ADJECTIVES), randomItem(NOUNS)].join(separator);

  return withNumber ? `${base}${randomNumber()}` : base;
}
