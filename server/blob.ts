import { del, list, put } from '@vercel/blob';
import { requireEnv } from './env';

const token = requireEnv('BLOB_READ_WRITE_TOKEN');

export const uploadAssetToBlob = async (pathname: string, file: Blob | Buffer) => {
  return put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
    token,
  });
};

export const listAssets = async (prefix?: string) => {
  return list({ token, prefix });
};

export const deleteBlobAsset = async (url: string) => {
  await del(url, { token });
};
