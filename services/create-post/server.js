import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";

const app = express();
app.use(express.json({ limit: "256kb" }));

const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.POSTS_CONTAINER || "posts";

if (!conn) {
  console.error("Missing AZURE_STORAGE_CONNECTION_STRING");
  process.exit(1);
}

const blobService = BlobServiceClient.fromConnectionString(conn);
const containerClient = blobService.getContainerClient(containerName);

app.post("/", async (req, res) => {
  try {
    const { title = "", author = "", content = "" } = req.body || {};
    if (!String(content).trim()) return res.status(400).json({ error: "Conteúdo é obrigatório" });

    await containerClient.createIfNotExists();

    const id = randomId();
    const post = {
      id,
      title: String(title).slice(0, 120),
      author: String(author).slice(0, 60),
      content: String(content).slice(0, 5000),
      createdAt: new Date().toISOString()
    };

    const body = JSON.stringify(post);
    const blobName = `${post.createdAt}_${id}.json`;
    const blockBlob = containerClient.getBlockBlobClient(blobName);

    await blockBlob.upload(body, Buffer.byteLength(body), {
      blobHTTPHeaders: { blobContentType: "application/json" }
    });

    res.status(201).json({ ok: true, id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`CreatePost running on :${port}`));

function randomId() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
