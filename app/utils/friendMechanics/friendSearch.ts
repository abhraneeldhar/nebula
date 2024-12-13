"use server";
import { mongoClientCS } from "../mongoConnector";
export async function FriendSearch(selfUserId:string,searchName: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const users = db.collection("users");
    const searchResults = await users.find({
        $or: [
          { username: { $regex: searchName, $options: "i" } },
          { name: { $regex: searchName, $options: "i" } }
        ],
        ...(selfUserId && { userId: { $ne: (selfUserId) } }), // Exclude the specific user
      }).toArray();

    const serializedUsers = searchResults.map(user => ({
        ...user,
        _id: user._id.toString(), // Convert ObjectId to a string
      }));
    return serializedUsers;
}