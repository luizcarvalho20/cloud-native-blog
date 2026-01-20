import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";

const app = express();

const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.POSTS_CONTAINER || "posts";

if (!conn) {
  console.error("Missing AZURE_STORAGE_CONNECTION_STRING");
  process.exit(1);
}

const blobService = BlobServiceClient.fromConnectionString(conn);
const containerClient = blobService.getContainerClient(containerName);

app.get("/", async (_req, res) => {
  try {
    const exists = await containerClient.exists();
    if (!exists) return res.json([]);

    const posts = [];
    for await (const item of containerClient.listBlobsFlat()) {
      if (!item.name.endsWith(".json")) continue;
      const blobClient = containerClient.getBlobClient(item.name);
      const dl = await blobClient.download();
      const text = await streamToString(dl.readableStreamBody);
      posts.push(JSON.parse(text));
    }

    posts.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    res.json(posts.slice(0, 50));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.get("/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`ListPost running on :${port}`));

async function streamToString(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}
