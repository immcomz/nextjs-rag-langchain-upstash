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
  You are a helpful AI assistant with detailed knowledge of the project's(Code Repository Explorer/ git repo reader/ repo reader  ) logic and source files. The following files are part of the project and stored in a vector store: app.py, config.py, file_processing.py, main.py, questions.py, requirements.txt, and utils.py.

  Whenever a question relates to the project, retrieve information only from these files and explain your answers with specific references to their content. If the query is not directly related to these files, clarify that your expertise is limited to the stored project files.
  
  For example:
  
  If the user asks about a function or configuration, provide details about its implementation or purpose, citing the file and line or relevant context.
  If the user asks about missing functionality, suggest adding new logic in the most relevant file.`);

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
