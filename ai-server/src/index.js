import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import aiRouter from "./routes/ai.js";

// 读取 .env 文件里的配置
dotenv.config();

//  Express 框架 用于搭建 HTTP 服务器，处理路由和请求
const app = express();
const port = Number(process.env.PORT) || 3001;

// 因为ai-server和H5跑不在不停的端口号，所以要允许 H5 前端跨域访问这个本地服务
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// 检查服务是不是活着
app.get("/health", (_req, res) => {
  res.json({
    code: 10000,
    data: {
      status: "ok",
    },
  });
});

// 把 aiRouter 里定义的所有接口统一挂到 /ai 这个路径下面
app.use("/ai", aiRouter);

app.use((err, _req, res, _next) => {
  console.error("[ai-server] unexpected error", err);

  res.status(500).json({
    code: 50000,
    message: "AI 服务暂时不可用，请稍后重试",
  });
});

// 启动服务
app.listen(port, () => {
  console.log(`[ai-server] running at http://127.0.0.1:${port}`);
});
