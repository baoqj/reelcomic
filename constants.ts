import { Drama, Episode, SubscriptionPlan, UserProfile, WatchProgress } from './types';

export const GENRES = [
  'All Genres',
  'Action',
  'Fantasy',
  'Romance',
  'Comedy',
  'Sci-Fi',
  'Suspense',
  'School',
];

const makeEpisode = (
  seriesId: string,
  number: number,
  title: string,
  durationSeconds: number,
  isLocked: boolean,
  thumbnail: string,
): Episode => {
  const mm = Math.floor(durationSeconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = (durationSeconds % 60).toString().padStart(2, '0');
  return {
    id: `${seriesId}-ep-${number}`,
    seriesId,
    number,
    title,
    duration: `${mm}:${ss}`,
    durationSeconds,
    isLocked,
    thumbnail,
  };
};

const posterA =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
const posterB =
  'https://images.unsplash.com/photo-1518131678677-a995febeccaa?auto=format&fit=crop&w=900&q=80';
const posterC =
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80';
const posterD =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';
const posterE =
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80';
const posterF =
  'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?auto=format&fit=crop&w=900&q=80';

export const MOCK_DRAMAS: Drama[] = [
  {
    id: 'gw-river',
    slug: 'gao-wu-tong-xia-shui-dao',
    title: '高武：让你通下水道，你把魔神捅穿了？',
    synopsis:
      '外卖员意外觉醒高武血脉，被迫在城市地下迷宫狩猎异种。每集 90 秒，高密度反转推进主线。',
    thumbnail: posterA,
    poster: posterA,
    rating: 4.9,
    views: '2.4M',
    tags: ['Action', 'Fantasy', 'Suspense'],
    status: 'ongoing',
    totalEpisodes: 120,
    releaseYear: '2026',
    cast: [
      {
        name: 'Kaito Sora',
        role: 'Main Voice',
        avatar:
          'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=320&q=80',
      },
    ],
    episodes: Array.from({ length: 18 }, (_, idx) =>
      makeEpisode(
        'gw-river',
        idx + 1,
        idx === 0 ? '下水道入口' : `异种围城 ${idx + 1}`,
        80 + ((idx * 7) % 35),
        idx > 2,
        posterA,
      ),
    ),
  },
  {
    id: 'ghost-insurance',
    slug: 'wo-gei-gui-yi-jiao-wu-xian',
    title: '我给诡异交五险',
    synopsis:
      '社保经办员误入诡异世界，靠人间制度整顿鬼域秩序。轻喜剧风格，适合碎片时间追更。',
    thumbnail: posterB,
    poster: posterB,
    rating: 4.7,
    views: '1.8M',
    tags: ['Comedy', 'Fantasy'],
    status: 'ongoing',
    totalEpisodes: 88,
    releaseYear: '2025',
    cast: [],
    episodes: Array.from({ length: 15 }, (_, idx) =>
      makeEpisode(
        'ghost-insurance',
        idx + 1,
        `鬼域社保局 ${idx + 1}`,
        75 + ((idx * 9) % 28),
        idx > 1,
        posterB,
      ),
    ),
  },
  {
    id: 'last-cable',
    slug: 'mo-ri-duan-wang-guang-lan-jiu-shi',
    title: '末日断网，我凭一根光缆救世',
    synopsis:
      '全球网络崩溃后，少年工程师与战术小队护送最后一段光缆。赛博末日风，节奏极快。',
    thumbnail: posterC,
    poster: posterC,
    rating: 4.8,
    views: '3.1M',
    tags: ['Sci-Fi', 'Action'],
    status: 'ongoing',
    totalEpisodes: 150,
    releaseYear: '2026',
    cast: [],
    episodes: Array.from({ length: 22 }, (_, idx) =>
      makeEpisode(
        'last-cable',
        idx + 1,
        `光缆中继站 ${idx + 1}`,
        85 + ((idx * 11) % 25),
        idx > 3,
        posterC,
      ),
    ),
  },
  {
    id: 'taizi-zombie',
    slug: 'sang-shi-wei-cheng-man-ji-tai-zi',
    title: '丧尸围城：满级太子降临末世',
    synopsis:
      '古代太子穿越到末世，用权谋和武力建立幸存者秩序。每集 60-100 秒，连载已完结。',
    thumbnail: posterD,
    poster: posterD,
    rating: 4.6,
    views: '1.2M',
    tags: ['Action', 'Suspense'],
    status: 'completed',
    totalEpisodes: 64,
    releaseYear: '2024',
    cast: [],
    episodes: Array.from({ length: 20 }, (_, idx) =>
      makeEpisode(
        'taizi-zombie',
        idx + 1,
        `末世王权 ${idx + 1}`,
        70 + ((idx * 5) % 30),
        idx > 0,
        posterD,
      ),
    ),
  },
  {
    id: 'campus-rank',
    slug: 'jing-diao-xia-ba-qiang-shen',
    title: '惊掉下巴女网管竟是绝世枪神',
    synopsis:
      '电竞馆网管白天打工，晚上化身排行榜第一狙神。校园+电竞+恋爱三线叙事。',
    thumbnail: posterE,
    poster: posterE,
    rating: 4.5,
    views: '980K',
    tags: ['School', 'Romance', 'Comedy'],
    status: 'ongoing',
    totalEpisodes: 96,
    releaseYear: '2025',
    cast: [],
    episodes: Array.from({ length: 12 }, (_, idx) =>
      makeEpisode(
        'campus-rank',
        idx + 1,
        `狙神登场 ${idx + 1}`,
        72 + ((idx * 8) % 40),
        idx > 2,
        posterE,
      ),
    ),
  },
  {
    id: 'myth-trial',
    slug: 'guo-yun-shen-hua-pu-xi',
    title: '国运审判：我编造了华夏神话谱系',
    synopsis:
      '文明对决中，少年用虚构神话体系逆转国运，逐集解锁人物与世界观。',
    thumbnail: posterF,
    poster: posterF,
    rating: 4.9,
    views: '4.0M',
    tags: ['Fantasy', 'Action', 'Suspense'],
    status: 'ongoing',
    totalEpisodes: 200,
    releaseYear: '2026',
    cast: [],
    episodes: Array.from({ length: 25 }, (_, idx) =>
      makeEpisode(
        'myth-trial',
        idx + 1,
        `神话谱系 ${idx + 1}`,
        90 + ((idx * 6) % 28),
        idx > 4,
        posterF,
      ),
    ),
  },
];

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'u_demo_001',
  displayName: 'NekoWatcher',
  avatarUrl:
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80',
  email: 'demo@reelcomic.app',
  isAdmin: true,
  vipTier: 'vip_yearly',
  vipExpiresAt: '2027-01-31T23:59:59Z',
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'vip-monthly',
    title: 'VIP Monthly',
    cycle: 'monthly',
    amountUsd: 9.99,
    perks: ['Ad-free', '1080p/4K', 'Early access episodes', 'Priority support'],
  },
  {
    id: 'vip-yearly',
    title: 'VIP Yearly',
    cycle: 'yearly',
    amountUsd: 95.99,
    perks: ['Everything in monthly', '2 months free', 'Exclusive badge', 'Limited events'],
  },
];

export const MOCK_WATCH_PROGRESS: WatchProgress[] = [
  {
    userId: 'u_demo_001',
    seriesId: 'gw-river',
    episodeId: 'gw-river-ep-6',
    progressSeconds: 58,
    completed: false,
  },
  {
    userId: 'u_demo_001',
    seriesId: 'last-cable',
    episodeId: 'last-cable-ep-4',
    progressSeconds: 95,
    completed: true,
  },
];
