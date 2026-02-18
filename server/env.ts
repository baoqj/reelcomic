export interface ServerEnv {
  DATABASE_URL: string;
  MUX_TOKEN_ID: string;
  MUX_TOKEN_SECRET: string;
  BLOB_READ_WRITE_TOKEN: string;
  APP_BASE_URL: string;
}

export const getServerEnv = (): Partial<ServerEnv> => ({
  DATABASE_URL: process.env.DATABASE_URL,
  MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
  MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  APP_BASE_URL: process.env.APP_BASE_URL,
});

export const requireEnv = (name: keyof ServerEnv): string => {
  const value = getServerEnv()[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};
