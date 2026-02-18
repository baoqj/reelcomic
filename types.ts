export interface Episode {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  duration: string;
  durationSeconds: number;
  isLocked: boolean;
  muxAssetId?: string;
  muxPlaybackId?: string;
  subtitleBlobUrl?: string;
  thumbnail: string;
}

export interface Series {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  thumbnail: string;
  poster: string;
  rating: number;
  views: string;
  tags: string[];
  status: 'ongoing' | 'completed';
  totalEpisodes: number;
  releaseYear: string;
  cast: { name: string; role: string; avatar: string }[];
  episodes: Episode[];
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string;
  email: string;
  isAdmin: boolean;
  vipTier: 'free' | 'vip_monthly' | 'vip_yearly';
  vipExpiresAt?: string;
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  cycle: 'monthly' | 'yearly';
  amountUsd: number;
  perks: string[];
}

export interface WatchProgress {
  userId: string;
  seriesId: string;
  episodeId: string;
  progressSeconds: number;
  completed: boolean;
}

// Backward compatibility: existing components still import Drama in multiple places.
export type Drama = Series;

export enum RoutePath {
  HOME = '/',
  CATEGORIES = '/categories',
  EXPLORE = '/explore',
  DETAILS = '/details',
  PLAYER = '/player',
  PROFILE = '/profile',
  SUBSCRIPTION = '/subscription',
  PLAYLIST = '/playlist',
  ADMIN = '/admin',
  ADMIN_CONTENT = '/admin/content',
}
