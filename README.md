# Build a RAG Application

## With LangChain Upstash Groq & Next.js

---

### Description

The @upstash/rag-chat package makes it easy to develop powerful retrieval-augmented generation (RAG) chat applications with minimal setup and configuration.

## Features

- Next.js compatibility with streaming support
- Ingest entire websites, PDFs, and more out of the box
- Built-in vector store for your knowledge base
- (Optional) built-in Redis compatibility for fast chat history management

---

Set up your environment variables:

```sh

UPSTASH_VECTOR_REST_URL="XXXXX"
UPSTASH_VECTOR_REST_TOKEN="XXXXX"


# if you use OpenAI compatible models
Groq_API_KEY="XXXXX"

# or if you use Upstash hosted models
QSTASH_TOKEN="XXXXX"

# Optional: For Redis-based chat history (default is in-memory)
UPSTASH_REDIS_REST_URL="XXXXX"
UPSTASH_REDIS_REST_TOKEN="XXXXX"

```

Configure RagChat Using Groq AI & Setup API for RagChat :

```sh

#app->lib->rag-chat.ts
export const ragChat = new RAGChat({
  model: groq("llama3-70b-8192", { apiKey: process.env.GROQ_API_KEY }),
  redis: redis,
});

#app->api->upstash-rag->route.ts
 const response = await ragChat.chat(lastMessage, {
    streaming: true,
    generatePrompt: prompt,

    //sessionId,
  });

```

### ⚙ Usage

- Provide your own .env.local file with an OpenAI API key
- create Upstash Vector Qtash & Redis Using Upstash Console
- Create Groq API
- npm install
- npm run dev

---

---

### 📚References

- 🔗 [LangChain JS/TS Docs](https://js.langchain.com/docs/get_started/introduction)
- 🔗 [Next.js](https://nextjs.org/)
- 🔗 [Vercel AI SDK](https://sdk.vercel.ai/docs)
- 🔗 [shadcn/ui](https://ui.shadcn.com/)
- 🔗 [Groq API](https://console.groq.com/login)
- 🔗 [Upstash](https://console.upstash.com/login)
- 🔗 [Upstash-RagChat](https://www.npmjs.com/package/@upstash/rag-chat)
