import { ragChat } from "@/lib/rag-chat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export const POST = async (req: NextRequest) => {
  //const { messages, sessionId } = await req.json();
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1].content;
  const prompt = PromptTemplate.fromTemplate(`
├── README.md
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── [...url]
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── chat
│   │   │   │   └── route.ts
│   │   │   ├── groq
│   │   │   │   └── route.ts
│   │   │   └── upstash-rag
│   │   │       └── route.ts
│   │   ├── components
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatWrapper.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── Messages.tsx
│   │   │   └── chat.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── ui
│   │       ├── button.tsx
│   │       └── input.tsx
│   ├── data
│   └── lib
│       ├── rag-chat.ts
│       ├── redis.ts
│       └── utils.ts
├── tailwind.config.ts
├── tsconfig.json
└── upstash_Vector
    ├── file_processing.py
    ├── requirements.txt
    └── upstash_vector.py abouve tree structure is relateed to the project file structure based on that and provided scope answer the question with code samples and brief explanation`);

  const response = await ragChat.chat(lastMessage, {
    streaming: true,
    generatePrompt: prompt,

    //sessionId,
  });

  //   const response = await ragChat.chat("Your question here", {
  //     streaming: true,
  //     namespace: "nstructured-github",
  //   });

  return aiUseChatAdapter(response);
};
