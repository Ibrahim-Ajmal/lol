
"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "model";
  text: string;
};

type Thread = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

type Attachment = {
  id: string;
  file: File;
  preview?: string;
};

const STORE = "bonit-ai-threads-v1";

function readThreads(): Thread[] {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "[]") as Thread[];
  } catch {
    return [];
  }
}

function createThread(): Thread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    messages: [],
    updatedAt: Date.now(),
  };
}

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore conversations from localStorage.
  useEffect(() => {
    const saved = readThreads();
    const initial = saved.length ? saved : [createThread()];

    setThreads(initial);
    setActiveId(initial[0].id);
    setHydrated(true);
  }, []);

  // Save conversations after restoring them.
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORE, JSON.stringify(threads));
    }
  }, [threads, hydrated]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, activeId, busy]);

  const active = useMemo(
    () => threads.find((thread) => thread.id === activeId),
    [threads, activeId]
  );

  function newChat() {
    const thread = createThread();

    setThreads((previous) => [thread, ...previous]);
    setActiveId(thread.id);
    setInput("");
    setAttachments([]);
    setError("");
  }

  function selectChat(id: string) {
    setActiveId(id);
    setAttachments([]);
    setError("");
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const selected = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setAttachments((previous) => [...previous, ...selected]);
  }

  function removeAttachment(id: string) {
    setAttachments((previous) => {
      const item = previous.find((attachment) => attachment.id === id);

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }

      return previous.filter((attachment) => attachment.id !== id);
    });
  }

  async function send() {
    const text = input.trim();

    if ((!text && attachments.length === 0) || busy || !active) return;

    const targetId = active.id;
    const prior = active.messages;
    const selectedAttachments = [...attachments];

    setInput("");
    setAttachments([]);
    setError("");
    setBusy(true);

    // Read supported text files locally.
    let attachmentContext = "";

    for (const attachment of selectedAttachments) {
      const file = attachment.file;
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (
        ["txt", "md", "csv", "json"].includes(extension || "") &&
        file.size <= 500_000
      ) {
        try {
          const content = await file.text();
          attachmentContext +=
            `\n\n--- File: ${file.name} ---\n${content}\n--- End file ---`;
        } catch {
          attachmentContext += `\n\n[Could not read ${file.name}]`;
        }
      } else {
        attachmentContext +=
          `\n\n[Selected attachment: ${file.name}. This file type is not yet connected to the BONIT backend.]`;
      }
    }

    const messageText =
      (text || "Please review my attached file.") + attachmentContext;

    const userMessage: Message = {
      role: "user",
      text:
        text +
        (selectedAttachments.length
          ? `\n\n📎 ${selectedAttachments.map((item) => item.file.name).join(", ")}`
          : ""),
    };

    const conversation = [...prior, { ...userMessage, text: messageText }].slice(-40);

    setThreads((previous) =>
      previous.map((thread) =>
        thread.id === targetId
          ? {
              ...thread,
              title:
                thread.messages.length === 0
                  ? (text || selectedAttachments[0]?.file.name || "New conversation").slice(0, 38)
                  : thread.title,
              messages: [...thread.messages, userMessage],
              updatedAt: Date.now(),
            }
          : thread
      )
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation.map((message) => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const answer: Message = {
        role: "model",
        text: data.reply || "I couldn't produce a response. Please try again.",
      };

      setThreads((previous) =>
        previous.map((thread) =>
          thread.id === targetId
            ? {
                ...thread,
                messages: [...thread.messages, answer],
                updatedAt: Date.now(),
              }
            : thread
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reach BONIT AI."
      );
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <main className="bonit-app">
      {sidebarOpen && (
        <aside className="bonit-sidebar">
          <Link href="/" className="back-home">
            ← Back to Home
          </Link>

          <div className="bonit-brand">
            <div className="bonit-logo">B</div>
            <span>
              BONIT<span className="brand-light"> AI</span>
            </span>
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>

          <button className="new-chat-button" onClick={newChat}>
            <span>＋</span> New chat
          </button>

          <div className="sidebar-label">YOUR WORKSPACE</div>

          <div className="history-list">
            {threads.map((thread) => (
              <button
                key={thread.id}
                className={`history-item ${
                  thread.id === activeId ? "active" : ""
                }`}
                onClick={() => selectChat(thread.id)}
              >
                <span className="history-icon">◷</span>
                <span className="history-title">{thread.title}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="account-avatar">B</div>
            <div className="account-info">
              <strong>BONIT AI</strong>
              <span>Personal workspace</span>
            </div>
            <span className="account-menu">•••</span>
          </div>
        </aside>
      )}

      <section className="bonit-main">
        <header className="bonit-topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button
                className="icon-button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                ☰
              </button>
            )}
            <span className="topbar-title">BONIT AI</span>
            <span className="model-tag">INTELLIGENCE</span>
          </div>

          <div className="topbar-right">
            <span className="online-dot" />
            <span className="online-label">Online</span>
          </div>
        </header>

        <div className="bonit-messages">
          {(!active || active.messages.length === 0) && (
            <div className="welcome-screen">
              <div className="welcome-mark">B</div>

              <div className="welcome-eyebrow">
                YOUR INTELLIGENCE, REIMAGINED
              </div>

              <h1>
                What can I help
                <br />
                <span>you with today?</span>
              </h1>

              <p className="welcome-description">
                Ask questions, explore ideas, write code, or discover
                something new.
              </p>

              <div className="suggestion-grid">
                {[
                  ["⌘", "Write some code", "Help me build a website"],
                  ["✧", "Explain something", "Explain quantum physics simply"],
                  ["↗", "Explore aviation", "How does an aircraft fly?"],
                  ["◈", "Solve a problem", "Help me solve a maths problem"],
                ].map(([icon, title, prompt]) => (
                  <button
                    key={title}
                    className="suggestion-card"
                    onClick={() => {
                      setInput(prompt);
                      textareaRef.current?.focus();
                    }}
                  >
                    <span className="suggestion-icon">{icon}</span>
                    <span className="suggestion-title">{title}</span>
                    <span className="suggestion-prompt">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="message-list">
            {active?.messages.map((message, index) => (
              <div
                key={`${active.id}-${index}`}
                className={`message-row ${message.role}`}
              >
                {message.role === "model" && (
                  <div className="message-avatar">B</div>
                )}

                <div className="message-content">
                  <div className="message-author">
                    {message.role === "user" ? "You" : "BONIT AI"}
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}

            {busy && (
              <div className="message-row model">
                <div className="message-avatar">B</div>
                <div className="message-content">
                  <div className="message-author">BONIT AI</div>
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            {error && <div className="chat-error">{error}</div>}
            <div ref={endRef} />
          </div>
        </div>

        <div className="bonit-composer-area">
          {attachments.length > 0 && (
            <div className="attachment-list">
              {attachments.map((attachment) => (
                <div className="attachment-chip" key={attachment.id}>
                  {attachment.preview ? (
                    <img src={attachment.preview} alt={attachment.file.name} />
                  ) : (
                    <span className="attachment-file-icon">▤</span>
                  )}
                  <span>{attachment.file.name}</span>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    aria-label={`Remove ${attachment.file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            className="bonit-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message BONIT AI..."
              rows={1}
              aria-label="Message BONIT AI"
            />

            <div className="composer-toolbar">
              <div className="composer-tools">
                <button
                  type="button"
                  className="tool-button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach files"
                >
                  ＋
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  accept="image/*,.txt,.md,.csv,.json,.pdf"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />

                <button
                  type="button"
                  className={`tool-button search-toggle ${
                    webSearch ? "selected" : ""
                  }`}
                  onClick={() => setWebSearch((value) => !value)}
                  title="Toggle web search"
                >
                  ◉ <span>Search</span>
                </button>
              </div>

              <div className="composer-right">
                <span className="enter-hint">↵ to send</span>
                <button
                  type="submit"
                  className="send-button"
                  disabled={
                    busy || (!input.trim() && attachments.length === 0)
                  }
                  aria-label="Send message"
                >
                  ↑
                </button>
              </div>
            </div>
          </form>

          <p className="composer-disclaimer">
            BONIT AI can make mistakes. Verify important information.
          </p>
        </div>
      </section>
    </main>
  );
}