# pzH5

`pzH5` 是陪诊系统的用户侧移动端应用，基于 Vue 3 + Vite + Vant 构建，主要负责用户登录、医院浏览、陪诊下单、订单查询和个人中心等功能。

当前版本中，这个子项目已经接入一个真实可调用的 AI 需求助手：在下单页通过自然语言生成结构化陪诊建议，并支持一键回填到订单需求表单。AI 功能默认通过本地 `ai-server` 中转到模型平台，而不是直接把 Key 暴露在前端。

---

## 项目定位

`pzH5` 面向普通用户，主要解决以下问题：

- 用户浏览医院与服务信息
- 用户发起陪诊订单
- 用户查看订单状态与订单详情
- 用户管理自己的基础信息和历史订单

和后台项目相比，`pzH5` 更偏用户体验和下单流程设计，是整个项目里最接近真实业务前台的部分。

---

## 技术栈

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

工程化相关：

- ESLint
- Oxlint
- Prettier
- npm-run-all2

---

## 目录结构

```text
pzH5/
├── public/                     # 静态资源
├── src/
│   ├── api/                    # 接口封装
│   ├── components/             # 公共组件
│   ├── pages/                  # 页面
│   ├── router/                 # 路由配置
│   ├── stores/                 # 状态管理
│   └── utils/                  # 请求封装 / AI 请求 / mock 工具
├── .env.example                # 本地 AI 服务地址示例
├── package.json
├── vite.config.js
└── README.md
```

其中几个关键目录：

- `src/pages/`：业务页面入口
- `src/components/`：页面复用组件
- `src/api/`：业务接口与 AI 接口入口
- `src/utils/`：请求封装、AI 请求封装、历史 mock 逻辑等工具

---

## 页面与路由

路由文件位置：

- [`src/router/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/router/index.js)

当前主要页面包括：

### 首页

- 路由：`/home`
- 文件：[`src/pages/home/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/home/index.vue)

主要职责：

- 展示首页轮播图
- 展示医院列表和服务入口
- 作为用户进入下单流程的入口

### 订单页

- 路由：`/order`
- 文件：[`src/pages/order/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/order/index.vue)

主要职责：

- 展示订单列表
- 按状态筛选订单
- 展示待支付订单的倒计时

### 用户中心

- 路由：`/user`
- 文件：[`src/pages/user/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/user/index.vue)

主要职责：

- 展示用户信息
- 进入订单页
- 执行退出登录

### 登录页

- 路由：`/login`
- 文件：[`src/pages/login/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/login/index.vue)

主要职责：

- 用户登录
- 登录成功后写入本地 token

### 创建订单页

- 路由：`/createOrder`
- 文件：[`src/pages/createOrder/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/createOrder/index.vue)

主要职责：

- 选择医院
- 选择就诊时间
- 选择陪诊员
- 填写接送地址和联系电话
- 填写陪诊需求
- 提交订单并生成支付二维码

这个页面也是当前 AI 功能接入的核心位置。

### 订单详情页

- 路由：`/detail`
- 文件：[`src/pages/detail/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/detail/index.vue)

主要职责：

- 展示订单详情
- 展示订单状态
- 展示支付二维码和流程信息

---

## AI 需求助手

### 功能目标

AI 需求助手不是一个泛聊天框，而是一个“下单辅助模块”。  
它的目标是降低用户填写陪诊需求的门槛，把自然语言整理成可直接用于订单提交的结构化建议。

例如用户输入：

```text
老人第一次去医院复诊，需要陪同挂号、看诊和取药。
```

系统会生成：

- 推荐服务类型
- 需求草稿
- 准备材料
- 风险提醒

并支持：

- 复制需求草稿
- 勾选确认风险提醒
- 一键填入订单表单

### 相关文件

页面接入：

- [`src/pages/createOrder/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/pages/createOrder/index.vue)

核心组件：

- [`src/components/AiDemandAssistant.vue`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/components/AiDemandAssistant.vue)

接口入口：

- [`src/api/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/api/index.js)

AI 请求封装：

- [`src/utils/aiRequest.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/aiRequest.js)

历史 mock 逻辑：

- [`src/utils/mockAiOrderDraft.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/mockAiOrderDraft.js)

对应的服务端项目：

- [`../ai-server/src/index.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/index.js)
- [`../ai-server/src/routes/ai.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/routes/ai.js)
- [`../ai-server/src/services/orderDraftService.js`](C:/Users/25329/Desktop/陪诊系统/ai-server/src/services/orderDraftService.js)

### 当前实现方式

当前默认实现不是前端本地 mock，而是通过本地 `ai-server` 调用真实模型接口：

1. `AiDemandAssistant.vue` 收集用户输入和页面上下文
2. `api.aiOrderDraft()` 调用本地 AI 接口
3. `src/utils/aiRequest.js` 将请求发送到 `VITE_AI_BASE_URL`
4. `ai-server` 负责：
   - 管理 API Key
   - 组织 Prompt
   - 调用模型平台
   - 清洗模型返回结果
5. 前端接收统一结构并完成展示、确认和回填

这样做的好处：

- 前端不暴露 Key
- 模型平台切换更容易
- Prompt 管理集中在服务端
- 模型输出不稳定的问题可以先在服务端兜底

### 当前返回结构

前端当前依赖的 AI 结果结构为：

```json
{
  "serviceType": "就医陪同",
  "demandDraft": "用户为大学生，主诉喉咙难受，需要陪同前往湘雅分院就诊，协助挂号、看诊及后续检查或开药。",
  "materials": ["身份证", "医保卡", "学生证（如有）"],
  "riskTips": ["建议提前确认就诊科室", "就诊当天注意保暖"]
}
```

### AI 请求链路

```text
AiDemandAssistant.vue
-> api.aiOrderDraft()
-> src/utils/aiRequest.js
-> http://127.0.0.1:3001/ai/order-draft
-> ai-server 组织 Prompt 并调用模型
-> ai-server 清洗结果
-> H5 展示并支持一键回填
```

### 关于 mock

项目里仍然保留了 [`src/utils/mockAiOrderDraft.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/mockAiOrderDraft.js)，它的作用主要是：

- 作为早期演示方案保留
- 方便后续需要离线展示或降级兜底时使用

但当前默认的 `api.aiOrderDraft()` 已不再直接调用它。

---

## 接口封装

接口入口文件：

- [`src/api/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/api/index.js)

目前包含的主要方法有：

- `login(data)`：用户登录
- `index()`：首页数据
- `h5Companion()`：下单页初始化数据
- `createOrder(data)`：提交订单
- `orderList(params)`：订单列表
- `orderDetail(params)`：订单详情
- `aiOrderDraft(data)`：AI 需求整理

业务请求封装文件：

- [`src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/request.js)

职责：

- 统一配置远程业务 `baseURL`
- 统一添加 `h-token`
- 处理登录失效场景

AI 请求封装文件：

- [`src/utils/aiRequest.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/aiRequest.js)

职责：

- 单独请求本地 `ai-server`
- 使用 `VITE_AI_BASE_URL` 配置本地服务地址
- 避免和原有业务请求层混在一起

---

## 运行环境

- Node.js `^20.19.0 || >=22.12.0`
- npm

---

## 安装与运行

### 安装依赖

```bash
npm install
```

### 配置本地 AI 服务地址

可在 `pzH5` 目录下新建 `.env` 或 `.env.development`：

```env
VITE_AI_BASE_URL=http://127.0.0.1:3001
```

也可以直接参考：

- [`./.env.example`](C:/Users/25329/Desktop/陪诊系统/pzH5/.env.example)

### 启动开发环境

```bash
npm run dev
```

说明：

- 当前 Vite 开发端口为 `4500`
- 如果要使用 AI 功能，需要先启动根目录下的 `ai-server`

### 构建生产版本

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

---

## 常用开发说明

### 登录校验

当前路由在进入非登录页时，会校验本地是否存在 `h5_token`：

- 文件：[`src/router/index.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/router/index.js)

如果没有 token，会自动跳转到 `/login`。

### 订单支付

当前下单成功后，会通过二维码形式展示支付入口：

- 使用 `qrcode` 将后端返回的支付地址转为二维码

### 页面组件风格

H5 页面主要基于 Vant 组件组织：

- `van-cell`
- `van-cell-group`
- `van-field`
- `van-button`
- `van-popup`
- `van-dialog`

因此这个子项目的界面风格偏移动端表单流和轻交互卡片。

### AI 功能调试

如果 AI 功能无法正常生成结果，优先检查：

1. `ai-server` 是否已启动
2. `VITE_AI_BASE_URL` 是否指向正确地址
3. `ai-server/.env` 中的 Key、Base URL 和模型名是否正确
4. 浏览器网络请求是否成功打到 `/ai/order-draft`

---

## 说明

这个 README 主要面向 `pzH5` 子项目本身。  
如果想了解整个仓库的双端结构、后台端和 `ai-server` 接入方案，可以再查看根目录的：

- [`../README.md`](C:/Users/25329/Desktop/陪诊系统/README.md)
