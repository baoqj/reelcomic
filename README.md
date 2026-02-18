# ReelComic

ReelComic 是一个动漫短剧播放平台（Web + Mobile），包含：
- 主页、分类页、详情页、播放页、用户资料页、会员订阅页
- Admin Panel（`/admin`）的控制面板和内容管理页
- Neon 数据库 schema、Vercel Blob 与 Mux 的接入点

## 1) 本地开发

前提：Node.js 20+

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认地址：`http://localhost:3000`

## 2) 构建

```bash
npm run build
```

## 3) 数据库（Neon）

执行 schema 和 seed：

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

核心表：
- `users`
- `series`
- `episodes`
- `tags` / `series_tags`
- `watch_progress`
- `subscription_plans` / `subscriptions` / `payments`
- `assets`（Vercel Blob + Mux 资产映射）
- `admin_audit_logs`

## 4) Mux / Blob / API 接入点

服务端文件：
- `server/neon.ts`
- `server/mux.ts`
- `server/blob.ts`

Vercel API 路由：
- `GET /api/health`
- `GET /api/series`
- `POST /api/admin/create-mux-asset`
- `POST /api/admin/upload-from-url`

前端数据访问：
- `services/seriesApi.ts`
- `hooks/useSeriesCatalog.ts`

## 5) Vercel 部署建议

1. GitHub 连接仓库 `https://github.com/baoqj/reelcomic.git`
2. Root Directory 设置为 `Code/reelcomic`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. 在 Vercel Project Settings 中配置 `.env.example` 对应变量

## 6) 安全提醒

PRD 中出现了 Mux Token Secret 明文。建议立即在 Mux 控制台轮换（rotate）该密钥，并将新密钥仅存放在 Vercel 环境变量，不要写入仓库。
