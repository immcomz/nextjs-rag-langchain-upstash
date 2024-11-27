import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { ChatWrapper } from "../components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { Chat } from "../components/chat";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) =>
    decodeURIComponent(component)
  );

  return decodedComponents.join("//");
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });

  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(
    /\//g,
    ""
  );

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrl
  );
  console.log("is url indexed: " + isAlreadyIndexed);

  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId,
  });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });
    console.log("Indexing urls again");

    await redis.sadd("indexed-urls", reconstructedUrl);
  }
  //   try {
  //     const unstructChat = await ragChat.context.add({
  //       options: {
  //         namespace: "unstructured-github",
  //       },
  //       fileSource:
  //         "/Volumes/Macintosh HD - Data/fullstack-aws-bootcamp/RepoReader",
  //       processor: {
  //         name: "unstructured",
  //         options: {
  //           apiKey: process.env.UNSTRUCTURED_IO_KEY,
  //           apiUrl: process.env.UNSTRUCTURED_API_URL,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //console.log(unstructChat.success);

  return <Chat />;
};

export default Page;
