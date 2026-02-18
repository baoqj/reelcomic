# PRD Mapping

对应 `PRD/reelcomic-PRD.md` 的实现状态：

## 页面
- 主页：`pages/Home.tsx`
- 分类页（桌面/移动）：`pages/Explore.tsx` + `/categories`
- 详情页：`pages/Details.tsx`
- 播放页：`pages/Player.tsx`
- 登录/注册页（含 Google / Apple OAuth）：`pages/Auth.tsx` + `/auth`
- 用户资料：`pages/Profile.tsx`
- 会员订阅：`pages/Shop.tsx` + `/subscription`
- Admin Dashboard：`pages/admin/Dashboard.tsx` + `/admin`
- Admin 内容管理：`pages/admin/DramaContent.tsx` + `/admin/content`

## 技术方案映射
- React 前端：Vite + React + TypeScript
- Web / Mobile 适配：Tailwind 响应式断点
- Neon：`database/schema.sql` + `server/neon.ts`
- Auth：`api/auth/*` + `server/auth/*` + Neon auth tables
- Vercel Blob：`server/blob.ts` + `api/admin/upload-from-url.ts`
- Mux：`server/mux.ts` + `api/admin/create-mux-asset.ts`

## 后续建议
- 接入真实鉴权（NextAuth / Clerk / 自建 JWT）
- 将 `api` 目录的 mock fallback 逐步切换为 DB + Cache
- 引入后台上传页与进度回调（Mux Webhook）联动 `episodes.stream_status`
