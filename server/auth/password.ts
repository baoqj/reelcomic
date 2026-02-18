import { createHash, pbkdf2Sync, timingSafeEqual, randomBytes } from 'crypto';

const ALGO = 'pbkdf2_sha256';
const ITERATIONS = 120000;
const KEY_LEN = 32;
const DIGEST = 'sha256';

const toBase64Url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

export const hashPassword = (password: string) => {
  const salt = randomBytes(16);
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);
  return `${ALGO}$${ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(derived)}`;
};

export const verifyPassword = (password: string, encodedHash: string) => {
  const [algo, iterStr, saltB64, hashB64] = encodedHash.split('$');
  if (algo !== ALGO || !iterStr || !saltB64 || !hashB64) return false;
  const iterations = Number(iterStr);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;
  const salt = Buffer.from(saltB64, 'base64url');
  const expected = Buffer.from(hashB64, 'base64url');
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, DIGEST);
  return timingSafeEqual(expected, actual);
};

export const hashSessionToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
