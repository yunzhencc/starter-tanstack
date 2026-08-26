# Starter TanStack

基于 TanStack Start、TanStack Query、Better Auth、Drizzle ORM 和 PostgreSQL 的全栈 TypeScript 起步项目。包含注册、登录和受保护的 `/app` 路由。

## 前置条件

- Node.js `24.19.0`（见 `.node-version`）
- pnpm `11.24.0`
- Docker Desktop（用于本地 PostgreSQL）

## 本地启动

```bash
pnpm install --frozen-lockfile
cp .env.example .env
# 在 .env 中设置 BETTER_AUTH_SECRET，例如：openssl rand -hex 32
docker compose up -d db
pnpm db:migrate
pnpm dev
```

应用默认运行在 [http://localhost:3000](http://localhost:3000)。

`.env` 至少需要以下变量：

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/starter_tanstack
BETTER_AUTH_SECRET=replace-with-a-random-secret
VITE_BASE_URL=http://localhost:3000
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm test --run` | 运行 Vitest 测试 |
| `pnpm test:e2e` | 运行 Playwright 认证流程 |
| `pnpm lint` | 运行 ESLint |
| `pnpm db:generate` | 生成 Drizzle 迁移 |
| `pnpm db:migrate` | 执行数据库迁移 |
| `pnpm auth:generate` | 生成 Better Auth 数据库 schema |
