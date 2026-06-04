# pzH5

`pzH5` 是陪诊系统的用户侧移动端应用，基于 Vue 3 + Vite + Vant 构建，主要负责用户登录、医院浏览、陪诊下单、订单查询和个人中心等功能。

当前版本中，这个子项目已经接入一个轻量 AI 演示能力：在下单页通过自然语言生成结构化陪诊建议，并支持一键回填到订单需求表单。

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
│   └── utils/                  # 工具函数 / mock 逻辑
├── package.json
├── vite.config.js
└── README.md
```

其中几个关键目录：

- `src/pages/`：业务页面入口
- `src/components/`：页面复用组件
- `src/api/`：业务接口与 AI mock 接口入口
- `src/utils/`：请求封装、AI mock 规则等工具逻辑

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

mock 逻辑：

- [`src/utils/mockAiOrderDraft.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/mockAiOrderDraft.js)

### 当前实现方式

目前 AI 能力没有直连真实大模型服务，而是使用本地 mock 进行演示：

- `api.aiOrderDraft()` 当前调用本地 mock
- mock 返回结构模拟真实 AI 接口
- 组件层已经按真实异步流程组织：输入、加载、结果、异常、回填

这样做的好处：

- 不依赖后端即可演示完整交互
- 更适合前端项目展示
- 后续替换为真实 AI 服务时，页面改动较小

### 当前 mock 规则

当前已支持的识别维度包括：

- 科室词：心内科、肿瘤科、骨科等
- 人群词：老人、儿童、孕妇等
- 动作词：挂号、缴费、取报告、检查、取药、看诊等
- 页面上下文：医院、就诊时间、陪诊员、服务名称

所以它虽然是 mock，但已经具备较强的“业务整理”形态。

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

请求封装文件：

- [`src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzH5/src/utils/request.js)

当前请求层职责：

- 统一配置 `baseURL`
- 统一添加 `h-token`
- 处理登录失效场景

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

### 启动开发环境

```bash
npm run dev
```

说明：

- 当前 Vite 开发端口为 `4500`

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

---

## 当前适合的展示点

如果你是把这个项目用于前端作品展示，`pzH5` 最有价值的点主要有：

1. 业务页面完整，有首页、下单、订单、详情、个人中心等典型流程
2. 下单页接入了“AI + 业务表单”的轻量功能，而不是单纯聊天框
3. 交互链路完整，包含输入、生成、风险确认、复制、回填等流程

---

## 后续可扩展方向

这个子项目后续可以继续往以下方向扩展：

- 将 `aiOrderDraft()` 替换为真实 AI 服务接口
- 新增“AI 推荐服务”在页面主表单中的展示
- 增加示例需求按钮和常用快捷输入
- 补充订单状态图、空态页和异常页
- 增加更清晰的接口文档和页面截图

---

## 说明

这个 README 主要面向 `pzH5` 子项目本身。  
如果想了解整个仓库的双端结构和项目概览，可以再查看根目录的：

- [`README.md`](C:/Users/25329/Desktop/陪诊系统/README.md)
