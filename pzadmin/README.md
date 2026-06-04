# pzadmin

`pzadmin` 是陪诊系统的后台管理端，基于 Vue 3 + Vite + Element Plus 构建，主要服务于管理员、运营人员和调度人员，负责订单管理、陪诊员管理、权限管理和数据看板等功能。

如果说 `pzH5` 主要面向用户下单体验，那么 `pzadmin` 更偏后台业务管理和运营工作流。

---

## 项目定位

`pzadmin` 的核心目标是提供一套后台运营界面，用来支撑陪诊业务的日常管理，包括：

- 后台用户登录
- 动态菜单与权限控制
- 管理员与用户组管理
- 陪诊员管理
- 订单管理
- 首页数据统计

从代码结构上看，这个子项目采用了“登录后按权限动态挂载路由”的方式来组织后台页面。

---

## 技术栈

- Vue 3
- Vue Router 5
- Element Plus
- Axios
- Pinia
- pinia-plugin-persistedstate
- ECharts
- Dayjs
- Less
- Vite

工程化相关：

- ESLint
- Oxlint
- Prettier
- npm-run-all2

---

## 目录结构

```text
pzadmin/
├── public/                      # 静态资源
├── src/
│   ├── api/                     # 接口封装
│   ├── components/              # 后台公共组件
│   ├── router/                  # 路由配置与导航守卫
│   ├── stores/                  # Pinia 状态管理
│   ├── utils/                   # 请求封装等工具逻辑
│   └── views/                   # 后台页面
├── package.json
├── vite.config.js
└── README.md
```

关键目录说明：

- `src/views/`：后台页面主体
- `src/components/`：如侧边栏、头部导航等公共结构组件
- `src/router/`：登录校验、动态菜单跳转、访问控制
- `src/stores/`：菜单状态、折叠状态、动态路由数据

---

## 页面与业务模块

### 登录页

- 文件：[`src/views/login/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/login/index.vue)

主要职责：

- 管理员登录
- 注册入口与验证码逻辑
- 登录成功后拉取菜单权限
- 将动态菜单写入 store，并挂载到路由

这个页面决定了后台权限体系是否能正常跑通，是整个后台的入口。

### 主框架页

- 文件：[`src/views/Main.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/Main.vue)

主要职责：

- 承载后台整体布局
- 左侧展示侧边菜单
- 顶部展示标签导航和用户信息
- 中间展示路由页面内容

这个页面是后台所有业务页面的外层壳子。

### 仪表盘

- 文件：[`src/views/dashboard/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/dashboard/index.vue)

主要职责：

- 展示后台用户信息
- 展示订单状态统计
- 使用 ECharts 展示趋势图

这个页面偏数据可视化和概览能力，是后台首页的重要组成部分。

### 权限管理

#### 管理员管理

- 文件：[`src/views/auth/admin/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/auth/admin/index.vue)

主要职责：

- 查看管理员列表
- 添加或编辑管理员信息
- 管理后台账号基础数据

#### 用户组管理

- 文件：[`src/views/auth/group/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/auth/group/index.vue)

主要职责：

- 管理用户组
- 配置菜单权限
- 支撑后台动态菜单与角色管理

### 陪诊业务管理

#### 订单管理

- 文件：[`src/views/vppz/order/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/vppz/order/index.vue)

主要职责：

- 查看订单列表
- 跟踪订单状态
- 执行订单相关操作

#### 陪诊员管理

- 文件：[`src/views/vppz/staff/index.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/views/vppz/staff/index.vue)

主要职责：

- 展示陪诊员信息
- 管理陪诊员资料
- 处理新增、审核、删除等管理动作

---

## 公共组件说明

后台布局和导航依赖几个关键公共组件：

### 侧边栏

- 文件：[`src/components/aside.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/components/aside.vue)

主要职责：

- 展示动态菜单
- 处理菜单点击跳转
- 配合折叠状态展示不同宽度

### 顶部导航

- 文件：[`src/components/navHeader.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/components/navHeader.vue)

主要职责：

- 展示标签式页面导航
- 展示当前登录用户
- 处理退出登录
- 控制侧边栏折叠状态

### 面板头部

- 文件：[`src/components/panelHead.vue`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/components/panelHead.vue)

主要职责：

- 用作部分页面的标题头区域
- 提升后台页面结构一致性

---

## 动态菜单与路由机制

后台路由文件位置：

- [`src/router/index.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/router/index.js)

当前后台的一个重要特点是：**登录后根据菜单权限动态挂载路由**。

大致流程如下：

1. 用户登录成功
2. 请求菜单权限接口
3. 将菜单权限写入 `Pinia`
4. 根据菜单数据为每个页面补上对应的 `component`
5. 使用 `router.addRoute()` 动态添加到主路由下

相关状态管理在：

- [`src/stores/index.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/stores/index.js)

其中 store 主要管理：

- `isCollapse`：侧边栏折叠状态
- `selectMenu`：顶部标签导航
- `routerList`：动态菜单/动态路由数据

说明：

- 当前实现依赖本地持久化的菜单数据
- 刷新后会从本地恢复动态菜单并重新构建路由

---

## 接口封装

接口入口文件：

- [`src/api/index.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/api/index.js)

当前包含的主要业务接口有：

- `getCode`：验证码
- `userAuthentication`：用户注册
- `login`：登录
- `autAdmin`：管理员列表
- `userGetMenu` / `userSetMenu`：菜单权限读取与修改
- `menuList` / `menuSelectList`：菜单数据管理
- `updateUser`：用户信息修改
- `menuPermissions`：用户菜单权限
- `photoList`：陪诊员头像列表
- `companion` / `companionList` / `deleteCompanion`：陪诊员相关
- `adminOrder` / `updateOrder`：订单相关
- `report`：首页统计数据

请求封装文件：

- [`src/utils/request.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/utils/request.js)

请求层的主要职责：

- 统一配置 `baseURL`
- 自动在请求头中添加后台 token
- 处理登录失效
- 清理本地缓存并回到登录态

---

## 状态管理

Pinia store 文件：

- [`src/stores/index.js`](C:/Users/25329/Desktop/陪诊系统/pzadmin/src/stores/index.js)

当前 store 的核心作用：

- 保存侧边栏折叠状态
- 保存顶部标签导航状态
- 保存动态路由菜单数据
- 根据后端菜单数据构建实际页面组件映射

项目中还启用了：

- `pinia-plugin-persistedstate`

这意味着部分后台状态会持久化到本地存储，用于刷新后恢复菜单与导航状态。

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

- 默认使用 Vite 开发端口，通常为 `5173`
- 如果端口被占用，Vite 会自动提示新的可用端口

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

## 开发说明

### 登录与 token

后台使用本地存储管理登录状态，关键字段包括：

- `pz_token`
- `pz_userInfo`
- `dataStore`

其中：

- `pz_token`：登录 token
- `pz_userInfo`：当前登录用户信息
- `dataStore`：持久化后的菜单与界面状态

### 菜单与页面跳转

由于后台采用动态菜单，首次登录后会根据返回的菜单权限决定能访问哪些页面。  
因此这个项目的路由不是全部写死在 `router/index.js` 里的，而是和后端返回菜单强绑定。

补充一点：

- 当用户已登录并访问 `/` 时，当前实现会优先跳转到本地缓存菜单里的第一个可访问页面

---

## 说明

这个 README 主要面向 `pzadmin` 子项目本身。  
如果想了解整个仓库的整体结构和 H5 端功能，可以查看根目录的：

- [`README.md`](C:/Users/25329/Desktop/陪诊系统/README.md)
