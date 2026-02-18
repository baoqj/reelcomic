import Mux from '@mux/mux-node';
import { requireEnv } from './env';

const mux = new Mux({
  tokenId: requireEnv('MUX_TOKEN_ID'),
  tokenSecret: requireEnv('MUX_TOKEN_SECRET'),
});

export const createMuxAssetFromUrl = async (inputUrl: string) => {
  return mux.video.assets.create({
    inputs: [{ url: inputUrl }],
    playback_policy: ['public'],
    mp4_support: 'none',
  });
};

export const getMuxAsset = async (assetId: string) => {
  return mux.video.assets.retrieve(assetId);
};

export const deleteMuxAsset = async (assetId: string) => {
  return mux.video.assets.delete(assetId);
};
