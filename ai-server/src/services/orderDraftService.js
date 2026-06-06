import { buildOrderDraftMessages } from "../prompts/orderDraftPrompt.js";
import normalizeAiResult from "../utils/normalizeAiResult.js";

const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const DEFAULT_MODEL = "deepseek-v4-pro";

function getApiKey() {
  return (
    process.env.AI_API_KEY ||
    process.env.DASHSCOPE_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    ""
  );
}

export async function generateOrderDraft(payload = {}) {
  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const context = payload.context || {};

  if (!text) {
    throw new Error("EMPTY_TEXT");
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const baseUrl = (
    process.env.AI_BASE_URL ||
    process.env.DEEPSEEK_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  const model =
    process.env.AI_MODEL || process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  // 超时控制
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: {
          type: "json_object",
        },
        messages: buildOrderDraftMessages({ text, context }),
      }),
      signal: controller.signal,
    });

    const raw = await response.json();

    if (!response.ok) {
      const upstreamMessage =
        raw?.error?.message || raw?.message || "上游模型调用失败";
      throw new Error(upstreamMessage);
    }

    const content = raw?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("EMPTY_MODEL_CONTENT");
    }

    const parsed = JSON.parse(content);
    return normalizeAiResult(parsed, text);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("REQUEST_TIMEOUT");
    }

    if (error instanceof SyntaxError) {
      throw new Error("INVALID_JSON_RESULT");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
