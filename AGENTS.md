# Agent 开发指南

## 项目约定

- 技术栈：TypeScript、React、TanStack Start/Router、TanStack Query、Better Auth、Drizzle ORM、PostgreSQL、shadcn/ui、Tailwind CSS。
- 包管理与脚本统一使用 `pnpm`；当前项目固定使用 `pnpm@11.24.0`。
- 修改前先阅读相关路由、服务函数和现有组件；不要为了未来需求新增抽象层、通用包装器或依赖。
- 类型应靠 Zod、函数签名和返回值推导。除非 TypeScript 无法表达真实约束，否则避免 `as`、多余泛型和手工重复类型。
- 在输入、认证、数据库和外部 API 边界做验证；不要用前端隐藏或路由跳转替代服务端授权。

## TanStack Start 与路由

- 文件路由位于 `src/routes/`；`src/routeTree.gen.ts` 是生成文件，不要手改，修改路由后运行 `pnpm generate-routes`。
- 已登录页面放在 `src/routes/_auth/**`，由 `src/routes/_auth/route.tsx` 的 `beforeLoad` 处理导航跳转。
- 仅访客页面放在 `src/routes/_guest/**`，由 `src/routes/_guest/route.tsx` 阻止已登录用户访问。
- Loader 和 `beforeLoad` 都是同构代码，不能直接访问数据库、文件系统、密钥或 `process.env`。
- 服务端读写使用 `createServerFn`；可在客户端静态导入其包装函数，名称使用 `$` 前缀，例如 `$getSession`。
- 服务端实现放在 `*.server.ts`，或使用 `@tanstack/react-start/server-only` 标记。不要让客户端组件导入 `auth.server.ts`、数据库模块或其他服务端实现。
- 不要在同构 Loader 中使用相对路径 `fetch('/api/...')`；优先调用服务函数。
- TanStack Query 负责服务端数据缓存与新鲜度，Router 负责参数、搜索参数校验、重定向和路由生命周期。不要把 Query 所有的数据复制进 Loader 数据或路由上下文。
- SSR Query 的结束流 hydration 已由 `patches/@tanstack__router-ssr-query-core@1.169.1.patch` 修复；升级 `@tanstack/router-ssr-query-core` 前，先核验上游是否已包含等效修复，再更新或移除该补丁及 `patchedDependencies`。

## 认证与数据库

- Better Auth 服务端配置位于 `src/lib/auth/auth.server.ts`，浏览器客户端位于 `src/lib/auth/auth-client.ts`。
- 受保护的服务函数和 API 必须使用 `src/lib/auth/middleware.ts` 的 `authMiddleware`；`_auth` 的路由守卫只负责导航体验，不能作为安全边界。
- 当前会话通过 `src/lib/auth/functions.ts` 的 `$getSession` 获取；需要共享服务端会话逻辑时复用 `session.server.ts`。
- `src/lib/db/schema/auth.schema.ts` 由 Better Auth 生成，禁止手工编辑。修改认证配置后运行 `pnpm auth:generate`，再检查生成差异并按需生成、执行 Drizzle 迁移。
- 本地数据库由 `docker-compose.yml` 提供。开发前复制 `.env.example` 为 `.env`，设置 `BETTER_AUTH_SECRET`，启动数据库后运行 `pnpm db:migrate`。
- 不要提交 `.env`、密钥、真实账号或生产数据库连接。

## UI 与文案

- 优先复用 `src/components/ui/` 中已有的 shadcn 组件；缺少基础组件时使用 shadcn CLI 添加，不要手写替代品或引入同类 UI 库。
- 图标使用已安装的 `lucide-react`；交互元素保留语义、键盘可用性和可访问名称。
- UI 文案面向用户，简洁说明结果和下一步；不要暴露提供商、内部状态或实现细节。
- 保持现有 `next-themes` 与主题切换的 SSR/hydration 行为，不要通过浏览器环境分支制造服务端和客户端不同的初始 DOM。

## 测试与验证

- Vitest 单测与组件测试放在源码附近，命名为 `*.test.ts` 或 `*.test.tsx`；Playwright 测试放在 `e2e/`，命名为 `*.spec.ts`。
- 优先执行最小相关验证：
  - `pnpm test --run`：Vitest 单测。
  - `pnpm test:e2e`：Playwright 认证/浏览器流程；需要本地 Docker PostgreSQL 已启动并迁移。
  - `pnpm exec tsc --noEmit`：类型检查。
  - `pnpm build`：生产构建或服务端/客户端边界变更后执行。
  - `pnpm lint`：全量 lint；若被既有无关问题阻断，执行并报告改动文件范围内的 ESLint 结果。
- 认证、路由守卫、服务端边界或用户流程变动时，运行相应 Playwright 用例。不要为框架行为、生成路由树或纯展示性静态标记堆砌测试。

## 工作流与 Git

- 修改前检查 `git status --short`，避免覆盖他人的暂存、未暂存或未跟踪改动。
- 提交前执行相关测试、`git diff --check`，并检查暂存区内容；提交使用简洁的 Conventional Commit。
- “提交代码”只创建本地提交；只有用户明确要求时才推送远端。
- 预提交钩子失败时先区分本次改动与既有问题；不要通过删除测试、放宽安全校验或提交密钥来让检查通过。
