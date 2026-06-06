# 陪诊系统

一个基于 Vue 3 + Vite 构建的陪诊服务项目，包含用户侧 H5 应用、运营侧管理后台，以及一个专门用于 AI 需求整理的 Node 中转服务。项目围绕“预约陪诊服务”这一核心流程展开，覆盖用户下单、订单查看、后台管理、人员管理和数据统计等场景。

当前项目最有代表性的扩展能力，是 H5 下单页里的 AI 需求助手。用户可以用自然语言描述陪诊需求，系统会结合当前页面上下文生成结构化建议，并支持一键回填到订单表单。

---

## 项目概览

当前仓库包含三个主要部分：

- `pzH5`：用户端 H5 移动应用
- `pzadmin`：后台管理端
- `ai-server`：AI 中转服务，负责管理 Key、组织 Prompt、调用模型并清洗结果

它们的分工如下：

- H5 端主要服务普通用户，重点在于下单体验、订单查询和个人中心
- 后台主要服务运营、管理员和调度人员，重点在于订单管理、人员管理和数据统计
- `ai-server` 不承担完整业务后端职责，只负责 AI 需求整理这条链路

从当前代码结构来看，这个项目属于典型的前后端分离前端仓库，H5 与后台分别维护自己的页面、路由和请求层；AI 能力则通过一个独立的 Node 服务和外部模型平台对接。

---

## 项目结构

```text
陪诊系统/
├── pzH5/                         # H5 移动端
│   ├── public/                   # 静态资源
│   ├── src/
│   │   ├── api/                  # 接口封装
│   │   ├── components/           # 公共组件
│   │   ├── pages/                # 页面
│   │   ├── router/               # 路由配置
│   │   ├── stores/               # 状态管理
│   │   └── utils/                # 工具函数 / AI 请求封装 / mock 逻辑
│   ├── .env.example              # H5 本地 AI 服务地址示例
│   ├── package.json
│   └── vite.config.js
├── pzadmin/                      # 管理后台
│   ├── public/                   # 静态资源
│   ├── src/
│   │   ├── api/                  # 接口封装
│   │   ├── components/           # 公共组件
│   │   ├── router/               # 路由配置
│   │   ├── stores/               # 状态管理
│   │   ├── utils/                # 工具函数
│   │   └── views/                # 后台页面
│   ├── package.json
│   └── vite.config.js
├── ai-server/                    # AI 中转服务
│   ├── src/
│   │   ├── prompts/              # Prompt 组织
│   │   ├── routes/               # AI 接口路由
│   │   ├── services/             # 模型调用服务
│   │   └── utils/                # 结果清洗工具
│   ├── .env.example              # 模型平台配置示例
│   └── package.json
└── README.md                     # 项目总说明
```

---

## 技术栈

### H5 端 `pzH5`

- Vue 3
- Vue Router 5
- Vant 4
- Axios
- Pinia
- qrcode
- Less
- Vite
- `unplugin-auto-import`
- `unplugin-vue-components`

### 后台端 `pzadmin`

- Vue 3
- Vue Router 5
- Element Plus
- Axios
- Pinia
- `pinia-plugin-persistedstate`
- ECharts
- Dayjs
- Less
- Vite

### AI 服务 `ai-server`

- Node.js
- Express
- dotenv
- cors
- OpenAI 兼容接口调用方式

### 工程化与规范

- ESLint
- Oxlint
- Prettier
- npm-run-all2

---

## 业务模块说明

### H5 端主要页面

#### 首页

位置：

- [`pzH5/src/pages/home/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/home/index.vue)

主要职责：

- 展示轮播图
- 展示合作医院或服务入口
- 作为用户进入下单流程的主要入口

#### 创建订单页

位置：

- [`pzH5/src/pages/createOrder/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/createOrder/index.vue)

主要职责：

- 选择医院
- 选择就诊时间
- 选择陪诊员
- 填写接送地址和联系电话
- 填写陪诊需求
- 生成支付二维码并完成下单

这个页面也是当前 AI 功能接入的核心位置。

#### 订单列表

位置：

- [`pzH5/src/pages/order/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/order/index.vue)

主要职责：

- 展示不同状态的订单
- 支持点击进入详情
- 展示待支付订单的倒计时信息

#### 订单详情

位置：

- [`pzH5/src/pages/detail/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/detail/index.vue)

主要职责：

- 展示订单的基本信息和状态
- 展示支付二维码
- 展示订单流程信息

#### 用户中心

位置：

- [`pzH5/src/pages/user/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/user/index.vue)

主要职责：

- 展示用户信息
- 进入订单页
- 退出登录

### 后台端主要页面

#### 登录页

位置：

- [`pzadmin/src/views/login/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/login/index.vue)

主要职责：

- 后台用户登录
- 登录后动态加载菜单权限

#### 仪表盘

位置：

- [`pzadmin/src/views/dashboard/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/dashboard/index.vue)

主要职责：

- 展示用户信息
- 展示订单状态统计
- 展示折线图数据

#### 订单管理

位置：

- [`pzadmin/src/views/vppz/order/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/vppz/order/index.vue)

主要职责：

- 查看订单列表
- 管理订单状态
- 处理订单业务流程

#### 陪诊员管理

位置：

- [`pzadmin/src/views/vppz/staff/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/vppz/staff/index.vue)

主要职责：

- 管理陪诊员信息
- 查看陪诊员详情
- 处理相关人员数据

#### 权限管理

位置：

- [`pzadmin/src/views/auth/admin/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/auth/admin/index.vue)
- [`pzadmin/src/views/auth/group/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/auth/group/index.vue)

主要职责：

- 管理管理员账号
- 管理用户组与菜单权限

---

## H5 AI 需求助手

当前项目中最有代表性的扩展功能，是 H5 创建订单页里的 AI 需求助手。

### 功能位置

页面位置：

- [`pzH5/src/pages/createOrder/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/createOrder/index.vue)

核心组件：

- [`pzH5/src/components/AiDemandAssistant.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/components/AiDemandAssistant.vue)

前端接口入口：

- [`pzH5/src/api/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/api/index.js)
- [`pzH5/src/utils/aiRequest.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/aiRequest.js)

AI 服务端入口：

- [`ai-server/src/index.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/index.js)
- [`ai-server/src/routes/ai.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/routes/ai.js)
- [`ai-server/src/services/orderDraftService.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/services/orderDraftService.js)

Prompt 与结果清洗：

- [`ai-server/src/prompts/orderDraftPrompt.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/prompts/orderDraftPrompt.js)
- [`ai-server/src/utils/normalizeAiResult.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/utils/normalizeAiResult.js)

历史 mock 参考：

- [`pzH5/src/utils/mockAiOrderDraft.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/mockAiOrderDraft.js)

### 设计目标

这个 AI 功能不是做成聊天机器人，而是作为“下单辅助工具”：

- 降低用户填写需求的门槛
- 把自然语言描述整理成更正式的订单需求文本
- 输出结构化建议，便于前端展示
- 让 AI 结果可以直接进入真实业务表单

### 当前能力

用户在下单页输入一句自然语言，例如：

```text
老人第一次去医院复诊，需要陪同挂号、看诊和取药。
```

系统会结合当前页面上下文（已选医院、时间、陪诊员、服务名称）生成：

- 推荐服务类型
- 需求草稿
- 准备材料
- 风险提醒

并支持：

- 复制需求草稿
- 确认风险提醒
- 一键填入订单表单

### 当前实现方式

当前默认实现已经不是纯前端 mock，而是“前端 + Node 中转 + 模型平台”的结构：

1. H5 端收集用户输入和页面上下文
2. 前端将请求发送给本地 `ai-server`
3. `ai-server` 读取环境变量中的 Key、模型地址和模型名
4. 服务端组织 Prompt，并调用 OpenAI 兼容接口
5. 模型返回 JSON 结果后，服务端会统一清洗
6. 前端拿到稳定结构后进行展示和回填

这样做的好处是：

- 前端不暴露 API Key
- Prompt 和模型切换都集中在服务端管理
- 模型输出不稳定的问题可以在服务端先兜住
- 前端组件层几乎不需要关心具体平台差异

### 当前接入方式

当前默认兼容阿里百炼 / DeepSeek 兼容模式，`.env.example` 中的默认配置为：

```env
AI_API_KEY=your_api_key
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=deepseek-v4-pro
PORT=3001
```

如果后续改为其他 OpenAI 兼容平台，通常只需要调整：

- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

而不需要重写前端交互层。

### AI 调用流程

```text
H5 下单页输入需求
-> AiDemandAssistant.vue 调用 api.aiOrderDraft()
-> pzH5/src/utils/aiRequest.js 请求本地 ai-server
-> ai-server/routes/ai.js 校验 text 和 context
-> ai-server/services/orderDraftService.js 读取配置并调用模型
-> ai-server/prompts/orderDraftPrompt.js 组织 messages
-> 模型返回 JSON 字符串
-> ai-server/utils/normalizeAiResult.js 清洗结果
-> 前端展示推荐服务、需求草稿、准备材料、风险提醒
-> 用户确认后，一键填入订单表单
```

---

## 运行环境

项目要求：

- Node.js `^20.19.0 || >=22.12.0`
- npm

建议使用较新的 Node 版本，以避免 Vite 和依赖包的兼容问题。

---

## 安装与启动

### 1. 启动 H5 端

```bash
cd pzH5
npm install
```

可选配置：

在 `pzH5` 目录下新建 `.env` 或 `.env.development`，内容可参考：

```env
VITE_AI_BASE_URL=http://127.0.0.1:3001
```

启动：

```bash
npm run dev
```

说明：

- 默认开发端口为 `4500`
- H5 端会通过 `VITE_AI_BASE_URL` 调用本地 `ai-server`

### 2. 启动 AI 服务

```bash
cd ai-server
npm install
```

在 `ai-server` 目录下新建 `.env`，内容可参考：

```env
AI_API_KEY=阿里百炼的模型平台 Key
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=deepseek-v4-pro
PORT=3001
```

启动：

```bash
npm run dev
```

说明：

- 默认端口为 `3001`
- 可通过 `http://127.0.0.1:3001/health` 检查服务是否启动成功

### 3. 启动后台端

```bash
cd pzadmin
npm install
npm run dev
```

说明：

- 后台使用 Vite 默认开发端口
- 登录后会按本地菜单权限数据动态加载页面

---

## 常用命令

### H5 端

```bash
cd pzH5
npm run dev
npm run build
npm run lint
npm run preview
```

### AI 服务

```bash
cd ai-server
npm run dev
npm run start
```

### 后台端

```bash
cd pzadmin
npm run dev
npm run build
npm run lint
npm run preview
```

---

## 接口与请求层

目前 H5、后台和 AI 服务分别承担不同职责。

### H5 请求封装

- [`pzH5/src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/request.js)

特点：

- 统一配置业务 `baseURL`
- 自动在请求头中携带 `h5_token`
- 处理登录失效场景

### H5 AI 请求封装

- [`pzH5/src/utils/aiRequest.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/aiRequest.js)

特点：

- 单独请求本地 `ai-server`
- 不和原有远程业务接口混用
- 便于切换本地 AI 服务地址

### 后台请求封装

- [`pzadmin/src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/utils/request.js)

特点：

- 自动携带后台登录 token
- 处理登录失效和权限相关逻辑

### AI 服务职责

- 管理模型平台 Key 和配置
- 组织 Prompt
- 调用 OpenAI 兼容模型接口
- 清洗模型结果
- 向前端返回统一结构和统一错误文案

---

## 工程化与代码质量

项目当前已接入：

- ESLint
- Oxlint
- Prettier

对应命令：

```bash
npm run lint
npm run build
```

近期已完成的验证包括：

- `pzH5` 的 `lint` 和 `build` 通过
- `ai-server` 可正常启动并通过 `/health` 检查

---

## 说明

这个 README 主要面向整个仓库的整体结构与 AI 接入方案。  
如果想分别查看两个前端子项目的详细说明，可以再查看：

- [`pzH5/README.md`](C:/Users/25329/Desktop/陪诊系统/pzH5/README.md)
- [`pzadmin/README.md`](C:/Users/25329/Desktop/陪诊系统/pzadmin/README.md)
