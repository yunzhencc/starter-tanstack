# 多语言设计

## 目标

为现有界面提供简体中文和 English，支持全局即时切换。首次访问按浏览器语言选择，用户手动选择后仅保存到浏览器本地。

## 范围

- 使用已安装的 `i18next` 和 `react-i18next`。
- 使用 `i18next-browser-languagedetector`，仅按 `localStorage`、`navigator` 的顺序探测并仅写入 `localStorage`。
- 提供 `zh-CN`、`en` 两份静态资源，默认 `zh-CN`。
- 翻译根路由、404、认证表单、认证错误兜底、主页、主题切换的无障碍标签及退出登录。
- 在根布局提供始终可见的语言切换器；认证和已登录页面均可使用。

## 非目标

- 不使用 `i18next-http-backend`，不请求或动态加载翻译文件。
- 不使用 cookie、URL、数据库或账号同步保存语言偏好。
- 不新增路由语言前缀，也不修改 Better Auth 的服务端响应。

## 架构与数据流

翻译资源和语言常量位于 `src/lib/i18n/`。根路由挂载 `I18nextProvider`，页面组件通过 `useTranslation` 读取文案。

服务端始终以 `zh-CN` 渲染。客户端挂载后，探测器依次读取 `localStorage` 和 `navigator.languages`；检测结果只允许为 `zh-CN` 或 `en`，否则回退到 `zh-CN`。切换器调用 `changeLanguage`，由探测器保存语言，并同步 `document.documentElement.lang`。

客户端延后探测可确保首屏服务端和客户端初始文案一致，避免 hydration 不一致；首次英文访问在挂载后切换为英文。

## 错误处理

- 认证服务返回的具体错误信息维持原样，避免错误翻译造成语义丢失；没有错误信息时使用本地化的通用认证失败提示。
- 缺失翻译键在开发环境可由 i18next 输出诊断，但界面保留键名，便于定位。

## 验证

- 为语言解析和本地偏好优先级添加单元测试。
- 执行 `pnpm test --run`、`pnpm exec tsc --noEmit`、`pnpm build` 与 `git diff --check`。
