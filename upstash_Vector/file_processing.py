# file_processing.py
import os
import uuid
import subprocess
from dotenv import load_dotenv

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import GithubFileLoader

load_dotenv()


def clone_github_repo(github_url, local_path):
    try:
        subprocess.run(['git', 'clone', github_url, local_path], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to clone repository: {e}")
        return False



def load_and_index_files(repo_path):
    """
    Load and index files from the specified repository path.

    Args:
        repo_path (str): Path to the local repository.

    Returns:
        tuple: Indexed documents, split documents, file type counts, and source paths.
    """
    extensions = [
        'txt', 'md',  'py', 'js', 'json', 'yaml', 'yml', 'ini', 'css','ts','tsx','css'
    ]

    file_type_counts = {}
    documents_dict = {}

    for ext in extensions:
        glob_pattern = f'**/*.{ext}'
        try:
            
            loader = GithubFileLoader(
            repo=os.getenv("GIT_REPO"),  # the repo name
            branch="main",  # the branch name
            access_token=os.getenv("GITHUB_TOKEN"),
            github_api_url="https://api.github.com",
            file_filter=lambda file_path: file_path.endswith( ext)
            )
            # Use DirectoryLoader to load files matching the extension
            #loader = DirectoryLoader(repo_path, glob=glob_pattern,recursive=True)

            loaded_documents = loader.load() if callable(loader.load) else []
            if loaded_documents:
                file_type_counts[ext] = len(loaded_documents)
                for doc in loaded_documents:
                    file_path = doc.metadata['source']
                    relative_path = os.path.relpath(file_path, repo_path)
                    file_id = str(uuid.uuid4())

                    # Update metadata
                    doc.metadata['source'] = relative_path
                    doc.metadata['file_id'] = file_id
                    documents_dict[file_id] = doc
        except Exception as e:
            # Log and skip files causing errors
            print(f"Error loading files with pattern '{glob_pattern}': {e}")
            continue

    # Split documents using RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=200)
    split_documents = []
    for file_id, original_doc in documents_dict.items():
        try:
            split_docs = text_splitter.split_documents([original_doc])
            for split_doc in split_docs:
                split_doc.metadata['file_id'] = original_doc.metadata['file_id']
                split_doc.metadata['source'] = original_doc.metadata['source']
            split_documents.extend(split_docs)
        except Exception as e:
            print(f"Error splitting document '{file_id}': {e}")
            continue

    return split_documents
    #return text_splitter.create_documents(split_documents)


# def search_documents(query, index, documents, n_results=5):
#     query_tokens = clean_and_tokenize(query)
#     bm25_scores = index.get_scores(query_tokens)

#     # Compute TF-IDF scores
#     tfidf_vectorizer = TfidfVectorizer(tokenizer=clean_and_tokenize, lowercase=True, stop_words='english', use_idf=True, smooth_idf=True, sublinear_tf=True)
#     tfidf_matrix = tfidf_vectorizer.fit_transform([doc.page_content for doc in documents])
#     query_tfidf = tfidf_vectorizer.transform([query])

#     # Compute Cosine Similarity scores
#     cosine_sim_scores = cosine_similarity(query_tfidf, tfidf_matrix).flatten()

#     # Combine BM25 and Cosine Similarity scores
#     combined_scores = bm25_scores * 0.5 + cosine_sim_scores * 0.5

#     # Get unique top documents
#     unique_top_document_indices = list(set(combined_scores.argsort()[::-1]))[:n_results]

#     return [documents[i] for i in unique_top_document_indices]
