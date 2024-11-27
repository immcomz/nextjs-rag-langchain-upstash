from dotenv import load_dotenv
from langchain_community.vectorstores.upstash import UpstashVectorStore

from langchain_community.document_loaders.unstructured import UnstructuredFileLoader
from langchain_community.document_loaders import DirectoryLoader


from upstash_vector import Index

import tempfile

from file_processing import clone_github_repo, load_and_index_files


# Load environment variables
load_dotenv()

def main():



    
    with tempfile.TemporaryDirectory() as local_path:
        # if clone_github_repo("https://github.com/gocallum/nextperson-prisma", local_path):
            split_documents = load_and_index_files(local_path)
            print(split_documents)
           
    #Initialise the Vector store automatically digest the env variables from above load_dotenv()        
    store = UpstashVectorStore(
    embedding=True,  # Embedding option enabled Use Upstash selected Embedded Model
)


   # adding documents to vector Store
    #store.add_documents(documents=split_documents)

#Perform a similarity search/ Indexing Vector Stores
    # query = "Code Repository Explorer" 
    # results = store.similarity_search(query, k=3)

    # print("Similarity Search Results:")
    # for res in results:
    #     print(res.page_content)


if __name__ == '__main__':
    main()