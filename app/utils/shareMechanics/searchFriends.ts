"use server";
import { userDetailsType } from "@/app/setupAccount/page";
import { mongoClientCS } from "../mongoConnector";
export async function FriendSearch(selfUserId:string,searchName: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const users = db.collection("users");
    const searchResults = await users.find({
        $and: [
          {
            $or: [
              { username: { $regex: searchName.trim(), $options: "i" } },
              { name: { $regex: searchName.trim(), $options: "i" } }
            ]
          },
          ...(selfUserId ? [{ friendList: { $in: [selfUserId] } }] : []), 
          ...(selfUserId ? [{ userId: { $ne: selfUserId } }] : []) 
        ]
      }).toArray();

    const serializedUsers = searchResults.map(user => ({
        ...user,
        _id: user._id.toString(),
      }));
    return serializedUsers;
}