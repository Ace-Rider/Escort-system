# 陪诊系统

一个基于 Vue 3 + Vite 构建的陪诊服务项目，包含用户侧 H5 应用和运营侧管理后台两部分。项目围绕“预约陪诊服务”这一核心流程展开，覆盖用户下单、订单查看、后台管理、人员管理和数据统计等场景。

当前项目还在 H5 下单页中加入了一个轻量 AI 演示能力：用户可以用自然语言描述陪诊需求，系统会结合当前页面上下文生成结构化建议，并支持一键回填到订单表单。

---

## 项目概览

项目分为两个子应用：

- `pzH5`：用户端 H5 移动应用
- `pzadmin`：后台管理端

它们共享同一套业务目标，但面向的角色不同：

- H5 端主要服务普通用户，重点在于下单体验、订单查询和个人中心
- 后台主要服务运营、管理员和调度人员，重点在于订单管理、人员管理和数据统计

从当前代码结构来看，这个项目属于典型的前后端分离前端仓库，H5 和后台分别维护自己的路由、API 封装、页面和组件。

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
│   │   └── utils/                # 工具函数 / mock 逻辑
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

接口入口：

- [`pzH5/src/api/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/api/index.js)

本地 mock 逻辑：

- [`pzH5/src/utils/mockAiOrderDraft.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/mockAiOrderDraft.js)

### 设计目标

这个 AI 功能不是做成聊天机器人，而是作为“下单辅助工具”：

- 降低用户填写需求的门槛
- 把自然语言描述整理成更正式的订单需求文本
- 输出结构化建议，便于前端展示
- 为未来接入真实 AI 接口预留数据结构

### 当前能力

用户在下单页输入一句自然语言，例如：

```text
老人第一次去医院复诊，需要陪同挂号、看诊和取药。
```

系统会结合当前页面上下文（已选医院、时间、陪诊员）生成：

- 推荐服务类型
- 需求草稿
- 准备材料
- 风险提醒

并支持：

- 复制需求草稿
- 确认风险提醒
- 一键填入订单表单

### 当前实现方式

目前 AI 能力没有直连真实模型，而是采用前端 mock 演示：

- `api.aiOrderDraft()` 当前调用的是本地 mock
- mock 会根据关键词和上下文推断结果
- 返回结构与未来真实 AI 接口尽量保持一致

这样做的好处是：

- 前端可以独立开发和演示
- 页面交互可以先跑通
- 后续替换成真实 AI 服务时，组件层改动较小

### mock 已支持的规则

当前 mock 规则已经支持以下维度：

- 科室词：心内科、肿瘤科、骨科等
- 人群词：老人、儿童、孕妇等
- 动作词：挂号、缴费、取报告、检查、取药、看诊等
- 上下文信息：医院、时间、陪诊员、服务名称

这使得它虽然不是“真 AI”，但在前端演示上已经能体现真实业务思路。

---

## 运行环境

项目要求：

- Node.js `^20.19.0 || >=22.12.0`
- npm

建议使用较新的 Node 版本，以避免 Vite 和依赖包的兼容问题。

---

## 安装与启动

### 启动 H5 端

```bash
cd pzH5
npm install
npm run dev
```

说明：

- 默认开发端口为 `4500`
- 启动后可在本地浏览器中访问对应地址进行调试

### 启动后台端

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

目前 H5 和后台都有各自独立的请求封装。

### H5 请求封装

- [`pzH5/src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/request.js)

特点：

- 统一配置 `baseURL`
- 自动在请求头中携带 `h5_token`
- 处理登录失效场景

### 后台请求封装

- [`pzadmin/src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/utils/request.js)

特点：

- 自动携带后台登录 token
- 处理登录失效和权限相关逻辑

### 当前说明

- 业务接口当前主要依赖远程服务
- AI 需求助手是前端 mock，不走真实后端 AI 服务

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

近期对 H5 端做过一轮整理，当前 AI 需求助手相关代码已经可以通过 `lint` 和 `build`。

---

