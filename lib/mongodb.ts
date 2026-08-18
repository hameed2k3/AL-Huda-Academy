import { MongoClient } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options = {
  maxPoolSize: 10,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise__) {
    client = new MongoClient(uri, options);
    global.__mongoClientPromise__ = client.connect();
  }

  clientPromise = global.__mongoClientPromise__;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(process.env.MONGODB_DB_NAME || "al_huda_quran_academy");
}
