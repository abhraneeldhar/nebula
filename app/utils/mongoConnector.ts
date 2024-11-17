import { MongoClient } from "mongodb";

export const mongoClientCS = new MongoClient(process.env.MONGO_CS as string);
