"use server"

import { mongoClientCS } from "./mongoConnector";

export const fetchUserId = async (userEmail: string) => {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });
    console.log("userid>>>>>>>> ", user?.userId.toString());
    return (user?.userId.toString());

}