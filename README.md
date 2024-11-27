# Build a RAG Application

## With LangChain Upstash Groq & Next.js

---

### Description

The @upstash/rag-chat package makes it easy to build RAG (Retrieval-Augmented Generation) chatbots with minimal setup. It uses Upstash Vector Store to embed and store data from Groq AI and GitHub files, enabling the bot to fetch relevant context and deliver responses.

You can also customize Prompt Templates to make responses more meaningful and tailored to your use case. With its simple configuration and integration with Upstash, this package is a great starting point for developers building powerful, context-aware chatbots.

## Features

- Next.js compatibility with streaming support
- Ingest entire websites, PDFs, and more out of the box
- Built-in vector store for your knowledge base
- (Optional) built-in Redis compatibility for fast chat history management

---

Set up your environment variables For Next APP:

```sh

UPSTASH_VECTOR_REST_URL="XXXXX"
UPSTASH_VECTOR_REST_TOKEN="XXXXX"


# if you use Groq compatible models
Groq_API_KEY="XXXXX"

# or if you use Upstash hosted models
QSTASH_TOKEN="XXXXX"

# Optional: For Redis-based chat history (default is in-memory)
UPSTASH_REDIS_REST_URL="XXXXX"
UPSTASH_REDIS_REST_TOKEN="XXXXX"

```

Set up your environment variables For Python APP:

```sh
GITHUB_TOKEN="Your Token"
UPSTASH_VECTOR_REST_URL="*****"
UPSTASH_VECTOR_REST_TOKEN="***"

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
- cd upstash_Vector
- run python3 Upstash_Vector.py

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
