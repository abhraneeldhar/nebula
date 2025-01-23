"use server";
// import { userDetailsType } from "@/app/setupAccount/page";
import { mongoClientCS } from "../mongoConnector";
export async function FriendSearch(selfUserId: string, searchName: string) {
  console.log("searching for friends")
  await mongoClientCS.connect();
  const db = mongoClientCS.db("notesApp");
  const users = db.collection("users");
  const searchResults = await users.find({
    $or: [
      { userName: { $regex: searchName.trim(), $options: "i" } },
      { name: { $regex: searchName.trim(), $options: "i" } }
    ],
    ...(selfUserId && { userId: { $ne: (selfUserId) } }), // Exclude the specific user
  }).toArray();

  const serializedUsers = searchResults.map(user => ({
    ...user,
    _id: user._id.toString(), // Convert ObjectId to a string
  }));
  // console.log("searched user: \n",serializedUsers)
  return serializedUsers;
}