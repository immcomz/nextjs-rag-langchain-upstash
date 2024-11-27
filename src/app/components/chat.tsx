"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for code

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/upstash-rag",
    onError: (e) => {
      console.error("Chat error:", e);
    },
  });

  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (chatParent.current) {
      chatParent.current.scrollTop = chatParent.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col w-full h-screen bg-background">
      {/* Header Section */}
      <header className="p-4 border-b w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Enhanced Code Chat</h1>
      </header>

      {/* Input Form Section */}
      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl mx-auto items-center"
        >
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button className="ml-2" type="submit">
            Submit
          </Button>
        </form>
      </section>

      {/* Chat Messages Section */}
      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
        <ul
          ref={chatParent}
          className="p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {messages.map((m, index) => (
            <li
              key={index}
              className={`flex ${m.role === "user" ? "" : "flex-row-reverse"}`}
            >
              <div className="rounded-xl p-4 bg-background shadow-md flex w-3/4">
                {/* Determine content type */}
                {m.content.includes("```") ? (
                  <RenderCodeSnippet content={m.content} />
                ) : (
                  <p className="text-primary">{m.content}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

/**
 * Component to render code snippets with proper syntax highlighting.
 */ /**
 * Component to render text and code snippets with syntax highlighting.
 */

function RenderCodeSnippet({ content }: { content: string }) {
  type Segment =
    | { type: "text"; value: string }
    | { type: "code"; value: string; language: string };

  const segments: Segment[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;

  content.replace(codeBlockRegex, (match, language, code, index) => {
    if (index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, index) });
    }

    segments.push({ type: "code", value: code, language: language || "text" });

    lastIndex = index + match.length;

    return match;
  });

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return (
    <div>
      {segments.map((segment, i) =>
        segment.type === "text" ? (
          <p key={i} className="text-primary">
            {segment.value}
          </p>
        ) : (
          <CodeSnippetWithCopy
            key={i}
            code={segment.value}
            language={segment.language}
          />
        )
      )}
    </div>
  );
}

function CodeSnippetWithCopy({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-sm rounded hover:bg-primary-dark"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={dracula}
        showLineNumbers
        wrapLines
        customStyle={{
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
