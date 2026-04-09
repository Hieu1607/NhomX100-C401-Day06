How to connect to cluster

1. Set environment variables. You can find or create new API keys on the API Keys section of your cluster.

WEAVIATE_URL="nwn7unxr5gnqcoz6n2ztw.c0.asia-southeast1.gcp.weaviate.cloud"
WEAVIATE_API_KEY="<Your API Key>"

2. Choose your preferred programming language and use the provided code snippet.

import os
import weaviate
from weaviate.classes.init import Auth

# Best practice: store your credentials in environment variables
weaviate_url = os.environ["WEAVIATE_URL"]
weaviate_api_key = os.environ["WEAVIATE_API_KEY"]

# Connect to Weaviate Cloud
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=weaviate_url,
    auth_credentials=Auth.api_key(weaviate_api_key),
)

print(client.is_ready())