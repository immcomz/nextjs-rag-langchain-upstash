import { ChatGroq } from "@langchain/groq";
import Groq from "groq-sdk";
import {
  StreamingTextResponse,
  OpenAIStream,
  createStreamDataTransformer,
} from "ai"; // Assuming this utility is provided by the ai package

export const dynamic = "force-dynamic";

// Initialize ChatGroq with API key and model
const chatGroq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Ensure type safety for the API key
});

export async function POST(req: Request): Promise<Response> {
  interface Message {
    role: "system" | "user"; // Set allowed roles for safety
    content: string;
  }

  // Extract `messages` from the request body
  const { messages }: { messages: Message[] } = await req.json();

  // Map messages to match the expected format
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    // Add any other required fields here (e.g., 'name' if necessary)
  }));

  // Call Groq to get a streaming response
  const stream = await getGroqChatStream(formattedMessages);

  // Return the stream using StreamingTextResponse
  return new StreamingTextResponse(stream);

  // return new StreamingTextResponse(
  //   stream.pipeThrough(createStreamDataTransformer())
  // );
}

export async function getGroqChatStream(
  messages: { role: "system" | "user"; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  // Call the Groq chat API with the provided messages and streaming enabled
  const responseStream = await chatGroq.chat.completions.create({
    messages,
    model: "llama3-70b-8192", // Adjust as needed
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true, // Enable streaming
  });
  const streams = OpenAIStream(responseStream);
  //const encoder = new TextEncoder();
  // return new ReadableStream({
  //   async start(controller) {
  //     try {
  //       for await (const chunk of responseStream) {
  //         const textContent = chunk.choices[0]?.delta?.content || "";

  //         // Stream letter by letter
  //         for (const char of textContent) {
  //           controller.enqueue(encoder.encode(char)); // Enqueue one character at a time
  //           console.log(char); // Log the character to the console
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error during streaming:", error);
  //     } finally {
  //       controller.close();
  //     }
  //   },
  // });
  return streams;
}
