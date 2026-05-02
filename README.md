# Between Us Cloud PWA

## 本地运行
1. 复制 `.env.local.example`，改名为 `.env.local`
2. 运行：
```bash
npm install
npm run dev
```

## Supabase
在 SQL Editor 运行 `supabase/schema.sql`。

Storage 创建公开 bucket：
```text
between-us-photos
```

## Vercel 环境变量
```env
VITE_SUPABASE_URL=https://plexugarwdkjsceelvxa.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_piAvb3hjOfpsTESeby84vQ_pMpEPNPL
```
