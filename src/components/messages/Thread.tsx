"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/db";

type Role = "PARENT" | "TUTOR";

export function Thread({
  unlockId,
  viewerRole,
  initialMessages,
}: {
  unlockId: string;
  viewerRole: Role;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Poll for new messages every 4s. Once we move to a real DB we'll swap this
  // for SSE/WebSockets — the rest of the UI stays the same.
  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const res = await fetch(`/api/threads/${unlockId}/messages`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { messages: Message[] };
        if (!stop) setMessages(data.messages);
      } catch {
        // network blip; ignore
      }
    }
    const id = setInterval(tick, 4000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [unlockId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setSending(true);
    setErr(null);

    // Optimistic append
    const tempId = `tmp_${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      unlockId,
      senderId: "me",
      senderRole: viewerRole,
      body: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setBody("");

    try {
      const res = await fetch(`/api/threads/${unlockId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!res.ok) {
        setMessages((m) => m.filter((x) => x.id !== tempId));
        setBody(trimmed);
        setErr("Couldn't send — try again.");
        return;
      }
      const data = (await res.json()) as { message: Message };
      setMessages((m) => m.map((x) => (x.id === tempId ? data.message : x)));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat">
      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">
            No messages yet. Say hi — your conversation stays here even if you also chat off-platform.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`bubble ${m.senderRole === viewerRole ? "mine" : "theirs"}`}>
              <div className="bubble-body">{m.body}</div>
              <div className="bubble-meta">
                {m.senderRole === viewerRole ? "You" : m.senderRole === "PARENT" ? "Parent" : "Tutor"}
                <span className="sep">·</span>
                <time dateTime={m.createdAt}>{new Date(m.createdAt).toLocaleString("en-AU")}</time>
              </div>
            </div>
          ))
        )}
      </div>
      <form className="chat-input" onSubmit={send}>
        <textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(e as unknown as React.FormEvent);
            }
          }}
        />
        <div className="chat-input-row">
          {err && <span className="chat-error">{err}</span>}
          <button type="submit" className="btn brand" disabled={sending || !body.trim()}>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
