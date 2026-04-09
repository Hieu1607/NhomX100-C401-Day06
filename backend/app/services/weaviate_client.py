import json
import os

import weaviate
from weaviate.classes.config import Configure, Property, DataType
from weaviate.classes.init import Auth

COLLECTION_NAME = "Document"
POLICY_COLLECTION_NAME = "ChinhSachQuyDinh"
WEAVIATE_EMBED_MODEL = "Snowflake/snowflake-arctic-embed-l-v2.0"


def get_weaviate_client() -> weaviate.WeaviateClient:
    """Connect to Weaviate Cloud cluster."""
    cluster_url = os.environ["WEAVIATE_URL"]
    api_key = os.environ["WEAVIATE_API_KEY"]

    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=cluster_url,
        auth_credentials=Auth.api_key(api_key),
    )
    return client


def create_collection(client: weaviate.WeaviateClient) -> None:
    """Create the Document collection with Weaviate Embeddings vectorizer."""
    if client.collections.exists(COLLECTION_NAME):
        print(f"Collection '{COLLECTION_NAME}' already exists, skipping.")
        return

    client.collections.create(
        COLLECTION_NAME,
        vector_config=[
            Configure.NamedVectors.text2vec_weaviate(
                name="content_vector",
                source_properties=["content"],
                model=WEAVIATE_EMBED_MODEL,
            )
        ],
        properties=[
            Property(name="content", data_type=DataType.TEXT),
            Property(name="chuong", data_type=DataType.TEXT),
            Property(name="dieu", data_type=DataType.TEXT),
            Property(name="source", data_type=DataType.TEXT),
            Property(name="doc_title", data_type=DataType.TEXT),
        ],
    )
    print(f"Collection '{COLLECTION_NAME}' created with vectorizer '{WEAVIATE_EMBED_MODEL}'.")


def index_chunks(client: weaviate.WeaviateClient, chunks_path: str) -> None:
    """Read chunks JSON and batch import into Weaviate. Vectorizer handles embeddings."""
    with open(chunks_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    collection = client.collections.get(COLLECTION_NAME)
    with collection.batch.fixed_size(batch_size=100) as batch:
        for chunk in chunks:
            batch.add_object(
                properties={
                    "content": chunk["content"],
                    "chuong": chunk["chuong"],
                    "dieu": chunk["dieu"],
                    "source": chunk["source"],
                    "doc_title": chunk["doc_title"],
                },
            )

    failed = collection.batch.failed_objects
    if failed:
        print(f"Failed to import {len(failed)} objects.")
        for obj in failed[:5]:
            print(f"  Error: {obj.message}")
    else:
        print(f"Indexed {len(chunks)} chunks into '{COLLECTION_NAME}'.")


def create_policy_collection(client: weaviate.WeaviateClient) -> None:
    """Create the ChinhSachQuyDinh collection with Weaviate Embeddings vectorizer."""
    if client.collections.exists(POLICY_COLLECTION_NAME):
        print(f"Collection '{POLICY_COLLECTION_NAME}' already exists, skipping.")
        return

    client.collections.create(
        POLICY_COLLECTION_NAME,
        vectorizer_config=Configure.Vectorizer.text2vec_weaviate(
            model=WEAVIATE_EMBED_MODEL,
        ),
        properties=[
            Property(name="policy_id", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="topic", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="content", data_type=DataType.TEXT),
            Property(name="source", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="category", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="audience", data_type=DataType.TEXT_ARRAY, skip_vectorization=True),
            Property(name="priority", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="effective_year", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="last_reviewed", data_type=DataType.TEXT, skip_vectorization=True),
            Property(name="keywords", data_type=DataType.TEXT_ARRAY, skip_vectorization=True),
        ],
    )
    print(f"Collection '{POLICY_COLLECTION_NAME}' created with vectorizer '{WEAVIATE_EMBED_MODEL}'.")


def index_policies(client: weaviate.WeaviateClient, policies_path: str) -> None:
    """Read policies JSON and batch import into Weaviate."""
    with open(policies_path, "r", encoding="utf-8") as f:
        policies = json.load(f)

    collection = client.collections.get(POLICY_COLLECTION_NAME)
    with collection.batch.fixed_size(batch_size=100) as batch:
        for policy in policies.values():
            batch.add_object(
                properties={
                    "policy_id": policy["policy_id"],
                    "topic": policy["topic"],
                    "content": policy["content"],
                    "source": policy["source"],
                    "category": policy["category"],
                    "audience": policy["audience"],
                    "priority": policy["priority"],
                    "effective_year": policy["effective_year"],
                    "last_reviewed": policy["last_reviewed"],
                    "keywords": policy["keywords"],
                },
            )

    failed = collection.batch.failed_objects
    if failed:
        print(f"Failed to import {len(failed)} objects.")
        for obj in failed[:5]:
            print(f"  Error: {obj.message}")
    else:
        print(f"Indexed {len(policies)} policies into '{POLICY_COLLECTION_NAME}'.")


def search_chinh_sach(query: str) -> str:
    """Search for relevant policy entries using Weaviate collection queries."""
    client = get_weaviate_client()
    try:
        return _search_collection(
            client=client,
            collection_name=POLICY_COLLECTION_NAME,
            query=query,
            fields=["policy_id", "topic", "content", "source", "category", "priority"],
        )
    finally:
        client.close()


def search_noi_quy(query: str) -> str:
    """Search for relevant regulation chunks using Weaviate collection queries."""
    client = get_weaviate_client()
    try:
        return _search_collection(
            client=client,
            collection_name=COLLECTION_NAME,
            query=query,
            fields=["chuong", "dieu", "content", "source", "doc_title"],
        )
    finally:
        client.close()


def _search_collection(
    client: weaviate.WeaviateClient,
    collection_name: str,
    query: str,
    fields: list[str],
    limit: int = 4,
) -> str:
    """Query a Weaviate collection and return JSON-safe results for the agent."""
    if not client.collections.exists(collection_name):
        return (
            f"Collection '{collection_name}' chưa được khởi tạo trong Weaviate. "
            "Hãy index dữ liệu trước khi tra cứu."
        )

    collection = client.collections.get(collection_name)

    try:
        response = collection.query.near_text(query=query, limit=limit)
    except Exception:
        try:
            response = collection.query.bm25(query=query, limit=limit)
        except Exception as exc:
            return f"Không thể truy vấn Weaviate lúc này: {exc}"

    results = []
    for obj in getattr(response, "objects", []) or []:
        props = getattr(obj, "properties", {}) or {}
        results.append({field: props.get(field, "") for field in fields})

    if not results:
        return f"Không tìm thấy kết quả phù hợp trong collection '{collection_name}'."

    return json.dumps(results, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    processed_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")
    chunks_file = os.path.join(processed_dir, "quy_dinh_truong_hoc_chunks.json")
    policies_file = os.path.join(processed_dir, "chinhsach_quydinh.json")

    client = get_weaviate_client()
    try:
        print(f"Connected: {client.is_ready()}")

        create_collection(client)
        index_chunks(client, chunks_file)

        create_policy_collection(client)
        index_policies(client, policies_file)
    finally:
        client.close()
