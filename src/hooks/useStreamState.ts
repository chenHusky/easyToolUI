import { fetchEventSource } from "@microsoft/fetch-event-source";
import { valueEquals } from "element-plus";
import { Ref, ref } from "vue";

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface MessageDocument {
  page_content: string;
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  type: string;
  role?: string; // for chat_retrieval bot
  content: string | MessageDocument[] | object;
  name?: string;
  tool_calls?: ToolCall[];
  example: boolean;
}

export interface Chat {
  assistant_id: string;
  thread_id: string;
  name: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export interface StreamState {
  status: "inflight" | "error" | "done";
  messages?: Message[] | Record<string, any>;
  run_id?: string;
}

export interface StreamStateProps {
  stream: Ref<StreamState | null>;
  startStream: (
    input: Message[] | Record<string, any> | null,
    thread_id: string,
    config?: Record<string, unknown>,
  ) => Promise<void>;
  stopStream?: (clear?: boolean) => void;
}

export function useStreamState(): StreamStateProps {
  const current = ref<StreamState | null>(null);
  const setCurrent = (data: StreamState) => {
    current.value = data;
  };
  const controller = ref<AbortController | null>(null);
  const setController = (data: AbortController | null) => {
    controller.value = data;
  };
  const startStream = async (
    input: Message[] | Record<string, any> | null,
    thread_id: string,
    config?: Record<string, unknown>,
  ) => {
    const controller = new AbortController();
    setController(controller);
    setCurrent({ status: "inflight", messages: input || [] });

    await fetchEventSource("/api-gpt/runs/stream", {
      signal: controller.signal,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, thread_id, config }),
      openWhenHidden: true,
      onmessage(msg) {
        if (msg.event === "data") {
          const messages = JSON.parse(msg.data);
          setCurrent({
            status: "inflight" as StreamState["status"],
            messages: mergeMessagesById(current.value?.messages, messages),
            run_id: current.value?.run_id,
          });
        } else if (msg.event === "metadata") {
          const { run_id } = JSON.parse(msg.data);
          setCurrent({
            status: "inflight",
            messages: current.value?.messages,
            run_id: run_id,
          });
        } else if (msg.event === "error") {
          setCurrent({
            status: "error",
            messages: current.value?.messages,
            run_id: current.value?.run_id,
          });
        }
      },
      onclose() {
        setCurrent({
          status: current.value?.status === "error" ? current.value.status : "done",
          messages: current.value?.messages,
          run_id: current.value?.run_id,
        });
        setController(null);
      },
      onerror(error) {
        setCurrent({
          status: "error",
          messages: current.value?.messages,
          run_id: current.value?.run_id,
        });
        setController(null);
        throw error;
      },
    });
  };

  const stopStream = (clear: boolean = false) => {
    controller.value?.abort();
    setController(null);
    if (clear) {
      setCurrent({
        status: "done",
        run_id: current.value?.run_id,
      });
    } else {
      setCurrent({
        status: "done",
        messages: current.value?.messages,
        run_id: current.value?.run_id,
      });
    }
  };

  return {
    startStream,
    stopStream,
    stream: current,
  };
}

function filterMsgs(msg: Message[] | Record<string, any> | null | undefined) {
  // type为tool时。content为字符串且为约定开头，取tool的值，若为对象，取后一个ai的值
  let isDelete = false;
  return (Array.isArray(msg) ? msg : msg?.messages).reduce((pre, next) => {
    if (['ai', 'human'].includes(next.type) && !isDelete && next.content) {
      pre.push(next)
    } else if (next.type === 'tool' && typeof(next.content) === 'string' && next.content.startsWith('<div class="chat-question-content">')) {
      pre.push(next);
      isDelete = true;
    } else if (isDelete) {
      isDelete = false;
    }
    return pre;
  }, [])
}

export function mergeMessagesById(
  left: Message[] | Record<string, any> | null | undefined,
  right: Message[] | Record<string, any> | null | undefined,
): Message[] {
  const leftMsgs = Array.isArray(left) ? left : left?.messages;
  const rightMsgs = Array.isArray(right) ? right : right?.messages;

  const merged = (leftMsgs ?? [])?.slice();
  for (const msg of rightMsgs ?? []) {
    const foundIdx = merged.findIndex((m: any) => m.id === msg.id);
    if (foundIdx === -1) {
      merged.push(msg);
    } else {
      merged[foundIdx] = msg;
    }
  }
  return filterMsgs(merged);
}
